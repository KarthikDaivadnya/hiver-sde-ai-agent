from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from ..database.connection import (
    get_db,
)

from ..database.repository import (
    count_interactions,
)


router = APIRouter()


@router.get(
    "/api/metrics"
)
def metrics(
    db: Session = Depends(
        get_db
    )
):

    return {
        "interaction_count":
            count_interactions(db)
    }