'''
Business: API для регистрации, авторизации и управления профилями пользователей
Args: event - dict с httpMethod, body (email, password, username)
      context - object с request_id, function_name
Returns: HTTP response с токеном и данными пользователя
'''

import json
import os
import hashlib
import secrets
from typing import Dict, Any
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST' and action == 'register':
        body_data = json.loads(event.get('body', '{}'))
        email = body_data.get('email', '').strip().lower()
        password = body_data.get('password', '').strip()
        username = body_data.get('username', '').strip()
        artist_name = body_data.get('artist_name', username).strip()
        
        if not email or not password or not username:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Email, password и username обязательны'})
            }
        
        if len(password) < 6:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Пароль должен содержать минимум 6 символов'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("SELECT id FROM users WHERE email = %s" % f"'{email}'")
        if cur.fetchone():
            cur.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Email уже зарегистрирован'})
            }
        
        cur.execute("SELECT id FROM users WHERE username = %s" % f"'{username}'")
        if cur.fetchone():
            cur.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Username уже занят'})
            }
        
        password_hash = hash_password(password)
        
        cur.execute('''
            INSERT INTO users (email, password_hash, username, artist_name, role)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, email, username, artist_name, role, created_at
        ''' % (f"'{email}'", f"'{password_hash}'", f"'{username}'", f"'{artist_name}'", "'artist'"))
        
        user = cur.fetchone()
        conn.commit()
        
        token = generate_token()
        
        user_data = dict(user)
        user_data['created_at'] = user_data['created_at'].isoformat()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'token': token,
                'user': user_data
            })
        }
    
    if method == 'POST' and action == 'login':
        body_data = json.loads(event.get('body', '{}'))
        email = body_data.get('email', '').strip().lower()
        password = body_data.get('password', '').strip()
        
        if not email or not password:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Email и password обязательны'})
            }
        
        password_hash = hash_password(password)
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT id, email, username, artist_name, bio, avatar_url, cover_url,
                   social_instagram, social_youtube, social_spotify, social_vk,
                   role, total_tracks, total_streams, total_earnings, created_at,
                   about_me, interests, achievements, followers_count, following_count
            FROM users
            WHERE email = %s AND password_hash = %s
        ''' % (f"'{email}'", f"'{password_hash}'"))
        
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Неверный email или пароль'})
            }
        
        token = generate_token()
        
        user_data = dict(user)
        user_data['created_at'] = user_data['created_at'].isoformat()
        user_data['total_earnings'] = float(user_data['total_earnings'])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'token': token,
                'user': user_data
            })
        }
    
    if method == 'GET' and action == 'profile':
        user_id = event.get('queryStringParameters', {}).get('user_id')
        
        if not user_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'user_id обязателен'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT id, email, username, artist_name, bio, avatar_url, cover_url,
                   social_instagram, social_youtube, social_spotify, social_vk,
                   role, total_tracks, total_streams, total_earnings, created_at,
                   about_me, interests, achievements, followers_count, following_count
            FROM users
            WHERE id = %s
        ''' % user_id)
        
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Пользователь не найден'})
            }
        
        user_data = dict(user)
        user_data['created_at'] = user_data['created_at'].isoformat()
        user_data['total_earnings'] = float(user_data['total_earnings'])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'user': user_data
            })
        }
    
    if method == 'GET' and action == 'get_all_users':
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute('''
            SELECT id, email, username, artist_name, bio, avatar_url, cover_url,
                   social_instagram, social_youtube, social_spotify, social_vk,
                   role, total_tracks, total_streams, total_earnings, created_at,
                   about_me, interests, achievements, followers_count, following_count
            FROM users
            ORDER BY created_at DESC
        ''')
        
        users = cur.fetchall()
        cur.close()
        conn.close()
        
        users_data = []
        for user in users:
            user_dict = dict(user)
            user_dict['created_at'] = user_dict['created_at'].isoformat()
            user_dict['total_earnings'] = float(user_dict['total_earnings'])
            users_data.append(user_dict)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'users': users_data
            })
        }
    
    if method == 'PUT' and action == 'profile':
        body_data = json.loads(event.get('body', '{}'))
        user_id = body_data.get('user_id')
        
        if not user_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'user_id обязателен'})
            }
        
        updates = []
        if 'artist_name' in body_data:
            updates.append(f"artist_name = '{body_data['artist_name']}'")
        if 'bio' in body_data:
            updates.append(f"bio = '{body_data['bio']}'")
        if 'avatar_url' in body_data:
            updates.append(f"avatar_url = '{body_data['avatar_url']}'")
        if 'cover_url' in body_data:
            updates.append(f"cover_url = '{body_data['cover_url']}'")
        if 'social_instagram' in body_data:
            updates.append(f"social_instagram = '{body_data['social_instagram']}'")
        if 'social_youtube' in body_data:
            updates.append(f"social_youtube = '{body_data['social_youtube']}'")
        if 'social_spotify' in body_data:
            updates.append(f"social_spotify = '{body_data['social_spotify']}'")
        if 'social_vk' in body_data:
            updates.append(f"social_vk = '{body_data['social_vk']}'")
        
        if not updates:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Нет данных для обновления'})
            }
        
        updates.append("updated_at = CURRENT_TIMESTAMP")
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = {user_id}"
        cur.execute(query)
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': 'Профиль обновлён'})
        }
    
    return {
        'statusCode': 404,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Endpoint not found'})
    }