from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import date
from app.database import get_db
from app.models import ResourceLog, User
from app.schemas import ResourceLogCreate, ResourceLogResponse, ResourceSummary
from app.security import verify_token
from app.services import resource_service

router = APIRouter()


@router.post("/log", response_model=ResourceLogResponse)
async def log_resource_usage(
    resource_data: ResourceLogCreate,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Log manual resource usage entry"""
    
    # Get user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prepare resource data dict
    data_dict = resource_data.model_dump()
    if not data_dict.get("date"):
        data_dict["date"] = date.today()
    
    # Log resource usage
    resource_log = await resource_service.log_resource_usage(user_id, data_dict, db)
    
    return ResourceLogResponse.from_orm(resource_log)


@router.get("/summary", response_model=ResourceSummary)
async def get_resource_summary(
    days: int = 30,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get resource usage summary with savings"""
    
    summary = await resource_service.get_resource_summary(user_id, db, days)
    
    return ResourceSummary(**summary)


@router.get("/budget-status", response_model=dict)
async def check_budget_status(
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Check if user is approaching resource budget limits"""
    
    budget_status = await resource_service.check_resource_budget(user_id, db)
    
    return budget_status


@router.get("/history", response_model=list[ResourceLogResponse])
async def get_resource_history(
    days: int = 30,
    user_id: int = Depends(verify_token),
    db: AsyncSession = Depends(get_db)
):
    """Get resource usage history"""
    
    from datetime import timedelta
    start_date = date.today() - timedelta(days=days)
    
    result = await db.execute(
        select(ResourceLog)
        .where(
            ResourceLog.user_id == user_id,
            ResourceLog.date >= start_date
        )
        .order_by(desc(ResourceLog.date))
    )
    logs = result.scalars().all()
    
    return [ResourceLogResponse.from_orm(log) for log in logs]
