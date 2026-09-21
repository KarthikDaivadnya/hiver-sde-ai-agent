def test_api_import():

    from backend.app.main import app

    assert (
        app.title
        == "Hiver AI Support Agent"
    )