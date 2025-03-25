from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time
import requests
import os
import re
import random

# Gemini API Key (replace with your actual key)
GEMINI_API_KEY = "AIzaSyCpChk5jbFjyPN2LroqY3DMVqOJJ5LfepU"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
HEADERS = {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY
}

# List of local media paths for sending (replace with your actual paths)
FRACTAL_IMAGES = [
    "C:/Users/nisar/OneDrive/Desktop/hack2infi_overrated/rgit_overrated/fractal1.jpg",
    "C:/Users/nisar/OneDrive/Desktop/hack2infi_overrated/rgit_overrated/fractal2.jpg",
    "C:/Users/nisar/OneDrive/Desktop/hack2infi_overrated/rgit_overrated/fractal3.jpg",
    "C:/Users/nisar/OneDrive/Desktop/hack2infi_overrated/rgit_overrated/fractal4.jpg",
]

MOTIVATIONAL_VOICE_NOTES = [
    "C:/Users/nisar/OneDrive/Desktop/hack2infi_overrated/rgit_overrated/WhatsApp Audio 2025-03-25 at 15.45.57_f8bdcfe6.mp3",
]

MOTIVATIONAL_VIDEOS = [
    "C:/Users/nisar/OneDrive/Desktop/hack2infi_overrated/rgit_overrated/super-fast-anti-anxiety-relief-point-dr-mandell-240-ytshorts.savetube.me.mp4",
]

# List of calming online links as a fallback
CALMING_LINKS = [
    "https://www.youtube.com/watch?v=5qXflvI2Xig",  # Calming fractal animation video
    "https://www.youtube.com/watch?v=5qXflvI2Xig",  # Relaxing nature sounds video
    "https://www.calm.com",                        # Mindfulness meditation website
]

# Updated wait_for_element_presence to check for visibility
def wait_for_element_presence(driver, by, locator, timeout=20):
    """Wait for an element to be visible and return it"""
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.visibility_of_element_located((by, locator))
        )
        return element
    except Exception as e:
        print(f"Element not found: {locator}")
        print(f"Error: {e}")
        driver.save_screenshot("error_screenshot.png")  # Save screenshot for debugging
        return None

def find_chat_element(driver, target_chat):
    """Try multiple selectors to find the chat"""
    possible_xpaths = [
        (By.XPATH, f"//span[@title='{target_chat}']"),
        (By.XPATH, f"//div[@title='{target_chat}']"),
        (By.XPATH, f"//span[contains(@title, '{target_chat}')]"),
        (By.XPATH, f"//div[contains(@title, '{target_chat}')]"),
        (By.XPATH, f"//span[text()='{target_chat}']")
    ]
    
    for by, xpath in possible_xpaths:
        element = wait_for_element_presence(driver, by, xpath)
        if element and element.is_displayed():
            return element
    
    return None

# Function to remove emojis from text
def remove_emojis(text):
    emoji_pattern = re.compile(
        '['
        '\U0001F600-\U0001F64F'  # Emoticons
        '\U0001F300-\U0001F5FF'  # Misc Symbols and Pictographs
        '\U0001F680-\U0001F6FF'  # Transport and Map Symbols
        '\U0001F700-\U0001F77F'  # Alchemical Symbols
        '\U0001F780-\U0001F7FF'  # Geometric Shapes Extended
        '\U0001F800-\U0001F8FF'  # Supplemental Arrows-C
        '\U0001F900-\U0001F9FF'  # Supplemental Symbols and Pictographs
        '\U0001FA00-\U0001FA6F'  # Chess Symbols
        '\U0001FA70-\U0001FAFF'  # Symbols and Pictographs Extended-A
        '\U00002702-\U000027B0'  # Dingbats
        '\U000024C2-\U0001F251'  # Enclosed Characters
        ']+',
        flags=re.UNICODE
    )
    return emoji_pattern.sub(r'', text)

# Function to normalize text for comparison
def normalize_text(text):
    return re.sub(r'\s+', ' ', text.strip()).lower()

# Function to get the last message time
def get_last_message_time(driver):
    time_xpath = "//span[contains(@class, 'x1rg5ohu')]"
    message_times = driver.find_elements(By.XPATH, time_xpath)
    if message_times:
        return message_times[-1].text
    return None

# Function to fetch the latest messages
def fetch_latest_messages(driver):
    print("Fetching the latest messages...")
    messages = driver.find_elements(By.XPATH, "//div[@role='row']")
    messages_data = []

    for message in messages[-5:]:
        try:
            message_container = message.find_element(By.XPATH, ".//div[contains(@class, 'message-in') or contains(@class, 'message-out')]")
            is_outgoing = "message-out" in message_container.get_attribute("class")
            sender = "You:" if is_outgoing else "Target:"
            
            message_text = message.find_element(By.XPATH, ".//div[contains(@class, '_akbu')]").text
            messages_data.append((sender, message_text))
        except Exception as e:
            print(f"Error in fetching message: {e}")
    
    return messages_data

# Function to send a message to WhatsApp with retry logic
def send_message_to_whatsapp(driver, message, media_path=None, retries=3):
    for attempt in range(retries):
        try:
            message_input_xpath = "//div[@role='textbox' and contains(@aria-placeholder, 'Type a message')]"
            message_input = wait_for_element_presence(driver, By.XPATH, message_input_xpath)
            if not message_input:
                raise Exception("Could not find message input box")
            message_input.send_keys(message)
            if media_path:
                # Try multiple locators for the "Attach" button
                attach_locators = [
                    (By.XPATH, "//span[@data-icon='clip']"),  # Paperclip icon
                    (By.XPATH, "//div[@aria-label='Attach']"),
                    (By.XPATH, "//div[@title='Attach']"),
                ]
                attach_button = None
                for by, locator in attach_locators:
                    attach_button = wait_for_element_presence(driver, by, locator, timeout=10)
                    if attach_button:
                        break
                if not attach_button:
                    raise Exception("Could not find the Attach button")
                attach_button.click()
                time.sleep(1)
                file_input = wait_for_element_presence(driver, By.XPATH, "//input[@type='file']")
                if file_input:
                    file_input.send_keys(os.path.abspath(media_path))
                    time.sleep(5)  # Increased wait time for larger files like videos
            message_input.send_keys(Keys.ENTER)
            print(f"Message sent: {message}")
            if media_path:
                print(f"Media sent: {media_path}")
            return True
        except Exception as e:
            print(f"Failed to send message (attempt {attempt + 1}/{retries}): {e}")
            time.sleep(5)  # Wait before retrying
    print("Failed to send message after all retries.")
    return False

# Function to detect distress and get AI response using Gemini API
def get_ai_response(user_message):
    distress_keywords = [
        "stressed", "anxious", "overwhelmed", "sad", "tired", "help", "lonely", "die",  
        "hopeless", "empty", "numb", "desperate", "worthless", "broken", "helpless",  
        "drained", "exhausted", "shattered", "frustrated", "angry", "disconnected",  
        "isolated", "scared", "panicked", "unloved", "rejected", "invisible",  
        "melancholy", "defeated", "useless", "restless", "shaky", "crying", "hurting",  
        "apathetic", "lost", "confused", "paralyzed", "despair", "grief", "aching",  
        "trapped", "forsaken", "miserable", "self-loathing", "pessimistic", "suffocating",  
        "fading", "crushed", "worn out", "drowning", "brokenhearted", "fearful",  
        "gloomy", "bleeding", "fragile", "aching", "unworthy", "regretful", "done"
    ]

    is_distress = any(keyword in user_message.lower() for keyword in distress_keywords)

    if not is_distress:
        return None

    prompt = f"""
    You are a mental health companion. A user said: '{user_message}'. 
    Detect signs of stress or anxiety and respond with a short, empathetic message 
    followed by a coping strategy (e.g., breathing exercise, journal prompt, mindfulness activity).
    Keep it conversational and supportive, and under 80 words.
    """

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    response = requests.post(GEMINI_API_URL, json=payload, headers=HEADERS)
    if response.status_code == 200:
        result = response.json()
        ai_response = result["candidates"][0]["content"]["parts"][0]["text"].strip()
        ai_response = remove_emojis(ai_response)
        print(f"Gemini Response: {ai_response}")
        return ai_response
    else:
        print(f"Gemini API failed: {response.status_code} - {response.text}")
        return "I’m here for you. Try taking 5 slow, deep breaths."

# Function to continuously monitor and respond
def continuously_fetch_messages(driver, target_chat, last_message_time, fetched_messages):
    sent_messages = set()  # Track messages sent by the script
    last_response_time = 0  # Track the last time a response was sent
    cooldown_period = 30  # 30 seconds cooldown (in seconds)

    while True:
        try:
            current_time = time.time()
            current_message_time = get_last_message_time(driver)
            if current_message_time and current_message_time >= last_message_time:
                latest_messages = fetch_latest_messages(driver)
                new_messages = []
                for sender, message_text in latest_messages:
                    if (sender, message_text) not in fetched_messages:
                        new_messages.append((sender, message_text))
                        fetched_messages.add((sender, message_text))
                
                if new_messages:
                    print("\nNew Messages:")
                    for msg in new_messages:
                        print(msg)
                    
                    for sender, user_message in new_messages:
                        # Skip messages sent by the script
                        normalized_message = normalize_text(user_message)
                        if any(normalize_text(sent_msg) == normalized_message for sent_msg in sent_messages):
                            continue
                        # Respond to messages from the target chat (incoming) or yourself (for testing)
                        if sender in ["Target:", "You:"]:
                            print(f"Detected message: '{user_message}'. Analyzing for distress...")
                            ai_response = get_ai_response(user_message)
                            if ai_response:
                                # Check cooldown period
                                if current_time - last_response_time < cooldown_period:
                                    print(f"Cooldown active. Skipping response. Next response available in {int(cooldown_period - (current_time - last_response_time))} seconds.")
                                    continue
                                # Send response
                                send_message_to_whatsapp(driver, ai_response)
                                sent_messages.add(ai_response)
                                # Randomly choose a media type to send
                                media_types = []
                                if FRACTAL_IMAGES:
                                    media_types.append(("image", FRACTAL_IMAGES, "Here’s a calming fractal to help you relax."))
                                if MOTIVATIONAL_VOICE_NOTES:
                                    media_types.append(("voice note", MOTIVATIONAL_VOICE_NOTES, "Here’s an inspiring voice note to lift your spirits!"))
                                if MOTIVATIONAL_VIDEOS:
                                    media_types.append(("video", MOTIVATIONAL_VIDEOS, "Here’s a motivational video to inspire you!"))
                                
                                if media_types:
                                    media_type, media_list, caption = random.choice(media_types)
                                    media_path = random.choice(media_list)
                                    # Try to send the media
                                    media_sent = send_message_to_whatsapp(driver, caption, media_path=media_path)
                                    if media_sent:
                                        sent_messages.add(caption)
                                    else:
                                        # Fallback: Send a calming online link
                                        calming_link = random.choice(CALMING_LINKS)
                                        link_message = f"Here’s a calming link to help you relax: {calming_link}"
                                        send_message_to_whatsapp(driver, link_message)
                                        sent_messages.add(link_message)
                                last_response_time = current_time
                
                last_message_time = current_message_time
            else:
                print("No new messages yet.")
            
            time.sleep(5)
        
        except Exception as e:
            print(f"Error occurred: {e}")
            time.sleep(5)

if __name__ == "__main__":
    options = Options()
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--verbose")  # For debugging ChromeDriver
    options.add_experimental_option("excludeSwitches", ["enable-logging"])  # Suppress TensorFlow warnings
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    try:
        print("Navigating to WhatsApp Web...")
        driver.get("https://web.whatsapp.com")
        print("Please scan the QR code to log in to WhatsApp Web (you have 90 seconds).")
        
        # Wait for chat pane to confirm login
        chat_pane = wait_for_element_presence(driver, By.XPATH, "//div[@id='pane-side']", timeout=90)
        if not chat_pane:
            raise Exception("Could not detect chat pane - login might have failed")

        # Updated search box locators based on provided HTML
        search_locators = [
            (By.XPATH, "//div[@aria-label='Search input textbox']"),  # Primary locator from HTML
            (By.XPATH, "//div[@role='textbox' and @title='Search']"),
            (By.XPATH, "//div[@contenteditable='true' and @data-tab='3']"),
            (By.CSS_SELECTOR, "div[role='textbox'][aria-label='Search input textbox']"),
        ]
        
        search_box = None
        for by, locator in search_locators:
            search_box = wait_for_element_presence(driver, by, locator, timeout=30)
            if search_box:
                print(f"Search box found with locator: {locator}")
                break
        
        if not search_box:
            raise Exception("Could not find the search box after trying multiple locators")
        
        print("WhatsApp Web loaded successfully")
        
        target_chat = "Paarth Wakare(DJ)"  # Updated to match the chat name
        print(f"Searching for chat: {target_chat}")
        
        search_box.clear()
        search_box.send_keys(target_chat)
        time.sleep(2)
        
        chat_element = find_chat_element(driver, target_chat)
        if not chat_element:
            raise Exception(f"Could not find chat: {target_chat}")
        
        print(f"Found chat: {target_chat}")
        chat_element.click()
        print("Chat opened successfully")
        time.sleep(3)
        
        # Start monitoring
        last_message_time = get_last_message_time(driver)
        fetched_messages = set()
        latest_messages = fetch_latest_messages(driver)
        for sender, message_text in latest_messages:
            fetched_messages.add((sender, message_text))

        continuously_fetch_messages(driver, target_chat, last_message_time, fetched_messages)
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        try:
            input("Press Enter to close the browser...")
            driver.quit()
        except:
            print("Browser already closed or error during cleanup.")