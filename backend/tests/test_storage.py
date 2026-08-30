import io
from unittest.mock import MagicMock, patch
from botocore.response import StreamingBody
from backend.app.services.storage import CloudflareR2StorageService, IStorageService


def test_storage_service_interface_inheritance():
    service = CloudflareR2StorageService()
    assert isinstance(service, IStorageService)


def test_r2_storage_upload_get_delete_lifecycle():
    service = CloudflareR2StorageService()
    service.bucket_name = "test-bucket"
    service.public_url = "https://media.test.com"

    mock_client = MagicMock()
    service._client = mock_client

    # 1. Upload Test File
    test_content = b"Christian Matrimony Media Test Payload"
    test_key = "tests/test_file.txt"
    upload_url = service.upload_file(
        file_obj=test_content,
        destination_path=test_key,
        content_type="text/plain",
    )
    mock_client.put_object.assert_called_once_with(
        Bucket="test-bucket",
        Key=test_key,
        Body=test_content,
        ContentType="text/plain",
    )
    assert upload_url == f"https://media.test.com/{test_key}"

    # 2. Retrieve / Access Test File
    stream = io.BytesIO(test_content)
    streaming_body = StreamingBody(stream, len(test_content))
    mock_client.get_object.return_value = {"Body": streaming_body}

    retrieved = service.get_file(test_key)
    assert retrieved == test_content
    mock_client.get_object.assert_called_once_with(
        Bucket="test-bucket",
        Key=test_key,
    )

    # 3. Delete Test File
    delete_result = service.delete_file(test_key)
    assert delete_result is True
    mock_client.delete_object.assert_called_once_with(
        Bucket="test-bucket",
        Key=test_key,
    )
