import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any;
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  data: null
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    
    openModal: (state, action: PayloadAction<{ type: string; data: any }>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
      state.data = null;
    },
  },
});


export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer; 