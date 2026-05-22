from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from config import Config
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import logging

logger = logging.getLogger(__name__)

class YouTubeService:
    
    def __init__(self):
        self.api_key = Config.YOUTUBE_API_KEY
        if self.api_key:
            self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        else:
            logger.warning("YouTube API key not configured")
            self.youtube = None
    
    def search_courses(self, domain, max_results=10):
        """Search for courses on YouTube based on domain"""
        if not self.youtube:
            return {'success': False, 'message': 'YouTube API not configured'}
        
        try:
            search_query = f"{domain} complete course tutorial"
            
            search_response = self.youtube.search().list(
                q=search_query,
                type='video',
                part='id,snippet',
                maxResults=max_results,
                videoDuration='long',
                videoCaption='closedCaption',
                order='relevance'
            ).execute()
            
            courses = []
            
            for item in search_response.get('items', []):
                video_id = item['id']['videoId']
                snippet = item['snippet']
                
                video_details = self.get_video_details(video_id)
                
                course = {
                    'video_id': video_id,
                    'title': snippet['title'],
                    'description': snippet['description'],
                    'thumbnail': snippet['thumbnails']['high']['url'],
                    'channel_name': snippet['channelTitle'],
                    'published_at': snippet['publishedAt'],
                    'duration': video_details.get('duration', ''),
                    'view_count': video_details.get('view_count', '0'),
                    'url': f"https://www.youtube.com/watch?v={video_id}"
                }
                
                courses.append(course)
            
            return {'success': True, 'courses': courses}
            
        except HttpError as e:
            logger.error(f'YouTube API error: {str(e)}')
            return {'success': False, 'message': f'YouTube API error: {str(e)}'}
        except Exception as e:
            logger.error(f'Error: {str(e)}')
            return {'success': False, 'message': f'Error: {str(e)}'}
    
    def get_video_details(self, video_id):
        """Get detailed information about a video"""
        if not self.youtube:
            return {}
        
        try:
            video_response = self.youtube.videos().list(
                part='contentDetails,statistics',
                id=video_id
            ).execute()
            
            if video_response['items']:
                item = video_response['items'][0]
                return {
                    'duration': item['contentDetails']['duration'],
                    'view_count': item['statistics'].get('viewCount', '0')
                }
            return {}
            
        except Exception as e:
            logger.error(f'Error getting video details: {str(e)}')
            return {}
    
    def get_transcript(self, video_id):
        """Get transcript of a video"""
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            try:
                transcript = transcript_list.find_transcript(['en'])
            except:
                transcript = transcript_list.find_generated_transcript(['en'])
            
            transcript_data = transcript.fetch()
            
            return {
                'success': True,
                'transcript': transcript_data
            }
            
        except TranscriptsDisabled:
            return {'success': False, 'message': 'Transcripts are disabled for this video'}
        except NoTranscriptFound:
            return {'success': False, 'message': 'No English transcript found for this video'}
        except Exception as e:
            logger.error(f'Error fetching transcript: {str(e)}')
            return {'success': False, 'message': f'Error fetching transcript: {str(e)}'}
    
    def get_video_info(self, video_id):
        """Get video information"""
        if not self.youtube:
            return {'success': False, 'message': 'YouTube API not configured'}
        
        try:
            video_response = self.youtube.videos().list(
                part='snippet,contentDetails',
                id=video_id
            ).execute()
            
            if video_response['items']:
                item = video_response['items'][0]
                snippet = item['snippet']
                
                return {
                    'success': True,
                    'title': snippet['title'],
                    'description': snippet['description'],
                    'channel': snippet['channelTitle'],
                    'thumbnail': snippet['thumbnails']['high']['url']
                }
            
            return {'success': False, 'message': 'Video not found'}
            
        except Exception as e:
            logger.error(f'Error getting video info: {str(e)}')
            return {'success': False, 'message': str(e)}