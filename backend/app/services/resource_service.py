from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import ResourceLog, User
from app.config import settings
from datetime import date, timedelta


async def calculate_water_savings(
    user_id: int,
    irrigation_duration: int,
    db: AsyncSession
) -> dict:
    """Calculate water savings vs traditional farming methods"""
    
    # Traditional flood irrigation: ~100 L/min per acre
    # KrishiDrishti drip irrigation: ~50 L/min per acre
    traditional_liters_per_min = 100
    optimized_liters_per_min = 50
    
    traditional_liters = irrigation_duration * traditional_liters_per_min
    optimized_liters = irrigation_duration * optimized_liters_per_min
    saved = traditional_liters - optimized_liters
    
    return {
        "used_liters": optimized_liters,
        "saved_liters": saved,
        "cost_saved_rupees": saved * 0.05,  # ₹0.05 per liter
        "efficiency_gain_percent": 50  # (saved / traditional) * 100
    }


async def log_resource_usage(
    user_id: int,
    resource_data: dict,
    db: AsyncSession
) -> ResourceLog:
    """Log resource usage with savings calculation"""
    
    # Calculate water savings
    irrigation_duration = resource_data.get("irradiation_duration_min", 0)
    water_savings = await calculate_water_savings(user_id, irrigation_duration, db)
    
    resource_log = ResourceLog(
        user_id=user_id,
        date=resource_data.get("date", date.today()),
        water_used_liters=resource_data.get("water_used_liters", water_savings["used_liters"]),
        irrigation_duration_min=irradiation_duration,
        water_saved_liters=water_savings["saved_liters"],
        fertilizer_used_grams=resource_data.get("fertilizer_used_grams", 0),
        fertilizer_type=resource_data.get("fertilizer_type"),
        estimated_cost_rupees=resource_data.get("estimated_cost_rupees", 0),
        energy_kwh=resource_data.get("energy_kwh", 0)
    )
    
    db.add(resource_log)
    await db.commit()
    await db.refresh(resource_log)
    
    return resource_log


async def get_resource_summary(
    user_id: int,
    db: AsyncSession,
    days: int = 30
) -> dict:
    """Get resource usage summary with savings"""
    
    # Get user's farm area
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user or not user.farm_area_acres:
        farm_area = 1  # Default 1 acre
    else:
        farm_area = user.farm_area_acres
    
    # Calculate date range
    start_date = date.today() - timedelta(days=days)
    
    # Get resource logs
    result = await db.execute(
        select(ResourceLog).where(
            ResourceLog.user_id == user_id,
            ResourceLog.date >= start_date
        )
    )
    logs = result.scalars().all()
    
    # Aggregate metrics
    total_water_used = sum(log.water_used_liters for log in logs)
    total_water_saved = sum(log.water_saved_liters for log in logs)
    total_fertilizer = sum(log.fertilizer_used_grams for log in logs)
    total_cost = sum(log.estimated_cost_rupees for log in logs)
    total_energy = sum(log.energy_kwh for log in logs)
    
    # Calculate budget
    water_budget = farm_area * settings.WATER_BUDGET_LITERS_PER_ACRE
    water_usage_pct = (total_water_used / water_budget * 100) if water_budget > 0 else 0
    
    # Status check
    if water_usage_pct >= 100:
        status = "CRITICAL"
        message = "Water budget exceeded! Reduce irrigation immediately."
    elif water_usage_pct >= 80:
        status = "WARNING"
        message = "80% water budget used. Conserve water for remaining days."
    else:
        status = "OK"
        message = "Resource usage within optimal range."
    
    return {
        "total_water_used_liters": total_water_used,
        "total_water_saved_liters": total_water_saved,
        "total_fertilizer_used_grams": total_fertilizer,
        "total_cost_rupees": total_cost,
        "total_energy_kwh": total_energy,
        "water_budget_liters": water_budget,
        "water_usage_percentage": round(water_usage_pct, 2),
        "status": status,
        "message": message,
        "farm_area_acres": farm_area,
        "period_days": days
    }


async def check_resource_budget(user_id: int, db: AsyncSession) -> dict:
    """Check if user is approaching resource budget limits"""
    
    # Get current week's usage
    start_of_week = date.today() - timedelta(days=date.today().weekday())
    
    result = await db.execute(
        select(ResourceLog).where(
            ResourceLog.user_id == user_id,
            ResourceLog.date >= start_of_week
        )
    )
    weekly_logs = result.scalars().all()
    
    weekly_water = sum(log.water_used_liters for log in weekly_logs)
    
    # Get user data
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user or not user.farm_area_acres:
        return {"status": "OK", "message": "No farm area set"}
    
    weekly_budget = user.farm_area_acres * settings.WATER_BUDGET_LITERS_PER_ACRE
    usage_pct = (weekly_water / weekly_budget * 100) if weekly_budget > 0 else 0
    
    if usage_pct >= 80:
        return {
            "status": "WARNING",
            "message": f"80% water budget used ({weekly_water:.0f}L / {weekly_budget:.0f}L)",
            "usage_percentage": usage_pct
        }
    
    return {
        "status": "OK",
        "message": f"Water usage: {weekly_water:.0f}L / {weekly_budget:.0f}L",
        "usage_percentage": usage_pct
    }
