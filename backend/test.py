from google import genai

print("Attempting to connect to the Anvil AI Brain...")

try:
    # We are directly injecting your key here for the test
    client = genai.Client(api_key="AIzaSyAPhJJUPCdOe7IWBZnYdRFo-txLF46Z6VE")
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents='Are you there, Anvil AI?'
    )
    
    print("\n✅ SUCCESS! The brain responded:")
    print(response.text)

except Exception as e:
    print("\n❌ CRASH REASON REVEALED:")
    print(str(e))