import { useState, useEffect } from 'react';
import { POSTS as INITIAL_POSTS } from './posts';
import type { Post } from './posts';

const STORAGE_KEY = 'inkhel_tech_posts_v1';
const DELETED_POSTS_KEY = 'inkhel_tech_deleted_posts_v1';

export function getDeletedPostIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(DELETED_POSTS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch (e) {
    console.error('Error reading deleted posts', e);
  }
  return new Set();
}

export function markPostDeleted(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const deleted = getDeletedPostIds();
    deleted.add(id);
    localStorage.setItem(DELETED_POSTS_KEY, JSON.stringify(Array.from(deleted)));
  } catch (e) {
    console.error('Error saving deleted posts', e);
  }
}

export function getStoredPosts(): Post[] {
  if (typeof window === 'undefined') return INITIAL_POSTS;
  const deletedIds = getDeletedPostIds();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter((p: Post) => !deletedIds.has(p.id));
      }
    }
  } catch (e) {
    console.error('Error reading posts from localStorage', e);
  }
  return INITIAL_POSTS.filter((p: Post) => !deletedIds.has(p.id));
}

export function savePostsToStorage(posts: Post[]) {
  if (typeof window === 'undefined') return;
  const deletedIds = getDeletedPostIds();
  const cleanPosts = posts.filter((p) => !deletedIds.has(p.id));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanPosts));
    window.dispatchEvent(new Event('inkhel_posts_updated'));
  } catch (e) {
    console.error('Error saving posts to localStorage', e);
  }
}

export async function syncLocalToServer(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const localPosts = getStoredPosts();
    const localCategories = getStoredCategories();
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ posts: localPosts, categories: localCategories }),
    });
    return res.ok;
  } catch (e) {
    console.error('Error syncing to server', e);
    return false;
  }
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(getStoredPosts());
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Fetch live posts from Cloudflare D1
  useEffect(() => {
    let isMounted = true;

    async function fetchLivePosts() {
      try {
        const res = await fetch('/api/posts', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && isMounted) {
            const deletedIds = getDeletedPostIds();
            const cleanPosts = data.filter((p: Post) => !deletedIds.has(p.id));
            setPosts(cleanPosts);
            savePostsToStorage(cleanPosts);
          }
        }
      } catch (e) {
        // Fallback silently to localStorage / INITIAL_POSTS
      }
    }

    fetchLivePosts();

    const handleUpdate = () => {
      setPosts(getStoredPosts());
    };
    window.addEventListener('inkhel_posts_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('inkhel_posts_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addPost = async (newPost: Post) => {
    const updated = [newPost, ...posts.filter((p) => p.id !== newPost.id)];
    savePostsToStorage(updated);
    setPosts(updated);

    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
    } catch (e) {
      console.error('Error saving post to Cloudflare D1', e);
    }
  };

  const updatePost = async (updatedPost: Post) => {
    const updated = posts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    savePostsToStorage(updated);
    setPosts(updated);

    try {
      await fetch(`/api/posts/${updatedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      });
    } catch (e) {
      console.error('Error updating post in Cloudflare D1', e);
    }
  };

  const deletePost = async (id: string) => {
    // 1. Mark as permanently deleted locally
    markPostDeleted(id);

    // 2. Remove from active state immediately
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    savePostsToStorage(updated);

    // 3. Delete from Cloudflare D1 database
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        console.error('Error deleting from D1:', await res.text());
      }
    } catch (e) {
      console.error('Error deleting post from Cloudflare D1', e);
    }
  };

  const resetToDefault = () => {
    savePostsToStorage(INITIAL_POSTS);
    setPosts(INITIAL_POSTS);
  };

  const triggerFullSync = async () => {
    setIsSyncing(true);
    const success = await syncLocalToServer();
    setIsSyncing(false);
    return success;
  };

  return {
    posts,
    addPost,
    updatePost,
    deletePost,
    resetToDefault,
    triggerFullSync,
    isSyncing,
  };
}

const CATEGORIES_STORAGE_KEY = 'inkhel_tech_categories_v2';
export const DEFAULT_CATEGORIES: string[] = [
  'Phone',
  'Laptop',
  'Tablet',
  'Camera',
  'Smartwatch',
  'Gadgets',
  'Tech News',
];

export function getStoredCategories(): string[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading categories from localStorage', e);
  }
  return DEFAULT_CATEGORIES;
}

export function saveCategoriesToStorage(categories: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('inkhel_categories_updated'));
  } catch (e) {
    console.error('Error saving categories to localStorage', e);
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(getStoredCategories());

  // 1. Fetch live categories from Cloudflare D1
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveCategories() {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setCategories(data);
            saveCategoriesToStorage(data);
          }
        }
      } catch (e) {
        // Fallback silently to local
      }
    }

    fetchLiveCategories();

    const handleUpdate = () => {
      setCategories(getStoredCategories());
    };
    window.addEventListener('inkhel_categories_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('inkhel_categories_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addCategory = async (name: string): Promise<{ success: boolean; message?: string }> => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { success: false, message: 'Category name cannot be empty' };
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, message: 'Category already exists' };
    }
    const updated = [...categories, trimmed];
    saveCategoriesToStorage(updated);
    setCategories(updated);

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
    } catch (e) {
      console.error('Error adding category to Cloudflare D1', e);
    }

    return { success: true };
  };

  const deleteCategory = async (categoryToDelete: string) => {
    const updated = categories.filter((c) => c !== categoryToDelete);
    saveCategoriesToStorage(updated);
    setCategories(updated);

    try {
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryToDelete }),
      });
    } catch (e) {
      console.error('Error deleting category from Cloudflare D1', e);
    }
  };

  const resetCategories = () => {
    saveCategoriesToStorage(DEFAULT_CATEGORIES);
    setCategories(DEFAULT_CATEGORIES);
  };

  return {
    categories,
    addCategory,
    deleteCategory,
    resetCategories,
  };
}
