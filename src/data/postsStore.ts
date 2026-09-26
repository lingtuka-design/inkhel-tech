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
        // Automatically merge any newly published baked-in posts
        const existingIds = new Set(parsed.map((p: Post) => p.id));
        const newBakedPosts = INITIAL_POSTS.filter((p) => !existingIds.has(p.id));
        if (newBakedPosts.length > 0) {
          const merged = [...newBakedPosts, ...parsed];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
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

const CATEGORIES_STORAGE_KEY = 'inkhel_tech_categories_v1';
export const DEFAULT_CATEGORIES: string[] = [
  'Smartphones',
  'Audio & Gadgets',
  'Buying Guides',
  'Deals',
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

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(getStoredCategories());
    };
    window.addEventListener('inkhel_categories_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('inkhel_categories_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addCategory = (name: string): { success: boolean; message?: string } => {
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
    return { success: true };
  };

  const deleteCategory = (categoryToDelete: string) => {
    const updated = categories.filter((c) => c !== categoryToDelete);
    saveCategoriesToStorage(updated);
    setCategories(updated);
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
