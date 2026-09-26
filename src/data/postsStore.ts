import { useState, useEffect } from 'react';
import { POSTS as INITIAL_POSTS } from './posts';
import type { Post } from './posts';

const STORAGE_KEY = 'inkhel_tech_posts_v1';

export function getStoredPosts(): Post[] {
  if (typeof window === 'undefined') return INITIAL_POSTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading posts from localStorage', e);
  }
  return INITIAL_POSTS;
}

export function savePostsToStorage(posts: Post[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    window.dispatchEvent(new Event('inkhel_posts_updated'));
  } catch (e) {
    console.error('Error saving posts to localStorage', e);
  }
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(getStoredPosts());

  useEffect(() => {
    const handleUpdate = () => {
      setPosts(getStoredPosts());
    };
    window.addEventListener('inkhel_posts_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('inkhel_posts_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addPost = (newPost: Post) => {
    const updated = [newPost, ...posts];
    savePostsToStorage(updated);
    setPosts(updated);
  };

  const updatePost = (updatedPost: Post) => {
    const updated = posts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    savePostsToStorage(updated);
    setPosts(updated);
  };

  const deletePost = (id: string) => {
    const updated = posts.filter((p) => p.id !== id);
    savePostsToStorage(updated);
    setPosts(updated);
  };

  const resetToDefault = () => {
    savePostsToStorage(INITIAL_POSTS);
    setPosts(INITIAL_POSTS);
  };

  return {
    posts,
    addPost,
    updatePost,
    deletePost,
    resetToDefault,
  };
}
