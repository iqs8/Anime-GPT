from pymongo import MongoClient
from  bs4 import BeautifulSoup
import requests
import openai
import smtplib
from email.message import EmailMessage

#scrape data and read/write from db 

client = MongoClient("insert a link to your database")
db = client["GPT"]  # Replace "mydatabase" with your database name
collection = db["All Text"]
collection.delete_many({})

res = requests.get("https://www.animenewsnetwork.com")
soup = BeautifulSoup(res.text, "html.parser")
a =soup.find_all("div", class_="mainfeed-day")
b = a[0]
Titles = []
Links = []

inner = b.select('.herald-boxes .t-news .wrap div h3 a')
for i in inner:
    title = i.text
    link = i['href']
    Titles.append(title)
    Links.append(link)

text = ""
for i in range(len(Titles)):
    res1 = requests.get("https://www.animenewsnetwork.com" + Links[i])
    soup = BeautifulSoup(res1.text, "html.parser")
    paragraphs = soup.select("p")

    for p in paragraphs:
        text += p.text.strip() + "\n"

half_length = len(text) // 2
# Insert the first entry with the first half of the text
first_half = text[:half_length]
collection.insert_one({"name": "first", "text": first_half.strip()})
# Insert the second entry with the second half of the text
second_half = text[half_length:]
collection.insert_one({"name": "second", "text": second_half.strip()})






openai.api_key = 'insert your open ai api key here'
messages = []
first_document = collection.find_one({"name": "first"})
first_text = first_document.get("text")
second_document = collection.find_one({"name": "second"})
second_text = second_document.get("text")


a = 'Below is pt1 of a document, I will ask a follow up about it. only reply with:"y" to this message\n'+first_text

c='''I will give you pt2 of the document below. It is complete when appended to pt1 given earlier. 
Imagine you are Anime-GPT, and your job is to extract and summarize all the information from part1 and part2 of the document (the entire document) 
into a newsletter. Be thorough and do not rush. 

Specifications for the newsletter:
Organize it numerically starting from 1 (1,2,3,etc) with the main stories beside the number and point form context within. The newsletter should also 
have a very short intro/greeting, and farewell/conclusion. The main stories are:'''+str(Titles)


d= '''
Output:
Your only output should be the newsletter that I directly send to the readers. Do not include headers and sign off as Anime-GPT
pt2 is below:\n\n'''

b = c+d+second_text
# a = a.replace(" ", "")
# b = b.replace(" ", "")




for i in range(0,2): 
    message =""
    if i ==0:
        message =a
    else:
        message=b
    messages.append({"role": "user", "content": message})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=messages)
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})
    print("\n" + reply + "\n")

    if i==1:
        

        # create email
        collection1 = db["emails"]
        emails = collection1.find()

        # Iterate over the emails
        for email in emails:
            email_address = "insert an email adress you want to send from"
            email_password = "and password"
            email_address1 = email.get("email")
            # Do something with the email address
            
            msg = EmailMessage()
            msg['Subject'] = "Email subject"
            msg['From'] = email_address
            msg['To'] = email_address1
            msg.set_content(reply+"\n\n"+"unsub link:\n\n"+"your-server/unsubscribe?email="+email_address1)
            try:
        # send email
                with smtplib.SMTP_SSL('m07.internetmailserver.net', 465) as smtp:
                    smtp.login(email_address, email_password)
                    smtp.send_message(msg)
                    print(f"Email sent successfully to {email_address1}")
            except Exception as e:
                # Handle error and remove email from collection
                print(f"Failed to send email to {email_address1}. Error: {str(e)}")
                collection1.delete_one({"email": email_address1})

      
