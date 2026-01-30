/* eslint-disable @typescript-eslint/no-explicit-any */
// getBoardsHook() : code for fetching list of tierboard or now what i call them as analysis boards  , a user has multiple boards // also send apt auth with the request since ofc the api are authenticated 
// getBoardHook() : give user auths, identification and give board identity to get the full board details as output
// setColumnOrderHook() : an api call that changes the order of the column 
// setTopicHook(): an api call that changes order of topic be it in a column or be int a diff column
// addTopicsHook( : add Topics to the defaultColumn of the boards -> they are later rearrnaged
// addNewBoardHook() : add new board for a new name and new color
//  setBoardHook(): lets the user edit board name and board color

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- CONFIG ---
const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return { 
    headers: { Authorization: `Bearer ${token}` } 
  };
};

// --- TYPES ---
// (Keeping these simple for now)
type Board = any; 
type ColumnOrderPayload = { boardId: string; newColumnOrder: string[] };
type MoveTopicPayload = { boardId: string; sourceColId: string; destColId: string; topicId: string; sourceIndex: number; destIndex: number };

// --- 1. GET ALL BOARDS ---
export const useGetBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/boards`, getAuthHeaders());
      setBoards(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return { boards, loading, error, refetch: fetchBoards };
};

// --- 2. GET SINGLE BOARD ---
export const useGetBoard = (boardId: string | null) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!boardId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/boards/${boardId}`, getAuthHeaders());
      setBoard(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  return { board, loading, error, refetch: fetchBoard };
};

// --- 3. REORDER COLUMNS ---
export const useSetColumnOrder = () => {
  const [loading, setLoading] = useState(false);

  const reorderColumns = async (payload: ColumnOrderPayload) => {
    setLoading(true);
    try {
      await axios.patch(
        `${API_URL}/boards/${payload.boardId}/columns/reorder`, 
        { order: payload.newColumnOrder }, 
        getAuthHeaders()
      );
    } catch (err) {
      console.error(err);
      throw err; // Re-throw so UI can handle the error (e.g. toast notification)
    } finally {
      setLoading(false);
    }
  };

  return { reorderColumns, loading };
};

// --- 4. MOVE/REORDER TOPICS ---
export const useSetTopic = () => {
  const [loading, setLoading] = useState(false);

  const moveTopic = async (payload: MoveTopicPayload) => {
    setLoading(true);
    try {
      await axios.patch(
        `${API_URL}/boards/${payload.boardId}/topics/move`, 
        payload, 
        getAuthHeaders()
      );
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { moveTopic, loading };
};

// --- 5. ADD TOPIC ---
export const useAddTopic = () => {
  const [loading, setLoading] = useState(false);

  const addTopic = async (boardId: string, content: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/boards/${boardId}/topics`, 
        { content }, 
        getAuthHeaders()
      );
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addTopic, loading };
};

// --- 6. ADD NEW BOARD ---
export const useAddNewBoard = () => {
  const [loading, setLoading] = useState(false);

  const createBoard = async (name: string, color: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/boards`, 
        { name, color }, 
        getAuthHeaders()
      );
      return res.data; // Return the new board so we can redirect to it
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBoard, loading };
};

// --- 7. EDIT BOARD SETTINGS ---
export const useSetBoard = () => {
  const [loading, setLoading] = useState(false);

  const updateBoard = async (boardId: string, data: { name?: string; color?: string }) => {
    setLoading(true);
    try {
      await axios.patch(
        `${API_URL}/boards/${boardId}`, 
        data, 
        getAuthHeaders()
      );
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateBoard, loading };
};
