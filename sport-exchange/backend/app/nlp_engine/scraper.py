import os
import feedparser
import praw
from dotenv import load_dotenv

load_dotenv()

# Reddit API setup
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

def scrape_reddit(query, max_results=50):
    try:
        posts = reddit.subreddit("all").search(query, sort="new", limit=max_results)
        return [f"{post.title} {post.selftext}" for post in posts]
    except Exception as e:
        print(f"Reddit scraping failed for '{query}': {e}")
        return []

def scrape_google_news(query, max_results=50):
    feed_url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}&hl=en-US&gl=US&ceid=US:en"
    feed = feedparser.parse(feed_url)
    return [entry.title + " " + entry.summary for entry in feed.entries[:max_results]]

def aggregate_social_sentiment(keywords):
    text = []
    for keyword in keywords:
        text += scrape_reddit(keyword)
        text += scrape_google_news(keyword)
    return text
