from fastapi import (
    FastAPI,
)

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from .api.analyze import (
    router as analyze_router,
)

from .api.health import (
    router as health_router,
)

from .api.metrics import (
    router as metrics_router,
)

from .database.connection import (
    engine,
)

from .database.models import (
    Base,
)

from backend.app.api.history import router as history_router

Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="Hiver AI Support Agent",
    description=(
        "Historically grounded AI customer "
        "support agent for AmazonHelp."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    health_router
)

app.include_router(
    analyze_router
)

app.include_router(
    metrics_router
)

app.include_router(history_router)

@app.get("/")
def root():

    return {

        "service":
            "Hiver AI Support Agent",

        "docs":
            "/docs",

    }