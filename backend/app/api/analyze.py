from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from ..core.dependencies import (
    get_agent,
)

from ..database.connection import (
    get_db,
)

from ..database.repository import (
    save_interaction,
)

from ..schemas.request import (
    AnalyzeRequest,
)

from ..schemas.response import (
    AnalyzeResponse,
)


router = APIRouter()


@router.post(
    "/api/analyze",
    response_model=AnalyzeResponse,
)
def analyze(

    payload: AnalyzeRequest,

    db: Session = Depends(
        get_db
    ),

):

    result = (
        get_agent()
        .analyze(
            payload.message
        )
    )

    save_interaction(
        db,
        result,
    )

    return result.to_dict()