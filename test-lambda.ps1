# Check if an image path is provided
if ($args.Count -eq 0) {
    Write-Host "Usage: .\test-lambda.ps1 <path-to-image>"
    exit 1
}

$imagePath = $args[0]

# Check if the file exists
if (-not (Test-Path $imagePath)) {
    Write-Host "Error: File $imagePath does not exist"
    exit 1
}

# Convert image to base64
$imageBytes = [System.IO.File]::ReadAllBytes($imagePath)
$imageBase64 = [Convert]::ToBase64String($imageBytes)

# Prepare the JSON payload
$jsonPayload = @{
    image = $imageBase64
} | ConvertTo-Json

# Lambda endpoint
$lambdaEndpoint = "https://gn1venwcwe.execute-api.us-east-1.amazonaws.com/Prod/process-image"

# Send the request to Lambda
try {
    $response = Invoke-RestMethod -Method Post -Uri $lambdaEndpoint -Body $jsonPayload -ContentType "application/json"
    Write-Host "`nFruit Analysis Results:`n"
    Write-Host $response.data
} catch {
    Write-Host "Error calling Lambda:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body:"
        Write-Host $responseBody
    }
} 