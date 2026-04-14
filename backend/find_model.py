from google import genai

# Using your direct key to bypass the Windows .env trap
client = genai.Client(api_key="AIzaSyAPhJJUPCdOe7IWBZnYdRFo-txLF46Z6VE")

print("🔍 Asking Google what Anvil AI brains are unlocked for your key...\n")

try:
    models = client.models.list()
    found_flash = False
    
    for m in models:
        # We only want to see the fast/free 'flash' models
        if "flash" in m.name.lower():
            print(f"✅ Available Model: {m.name}")
            found_flash = True
            
    if not found_flash:
        print("❌ No Flash models found. Your key might not have free-tier access enabled.")

except Exception as e:
    print(f"❌ CRASH REASON: {str(e)}")