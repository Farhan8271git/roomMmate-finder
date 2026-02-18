// frontend/src/store/slices/listingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  listings: [],
  myListings: [],
  currentListing: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1
};

// Get all listings
export const getAllListings = createAsyncThunk(
  'listings/getAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`/listings?${queryString}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get single listing
export const getListingById = createAsyncThunk(
  'listings/getById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/listings/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get my listings
export const getMyListings = createAsyncThunk(
  'listings/getMy',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/listings/my-listings');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create listing
export const createListing = createAsyncThunk(
  'listings/create',
  async (listingData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/listings/create', listingData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update listing
export const updateListing = createAsyncThunk(
  'listings/update',
  async ({ id, listingData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/listings/${id}`, listingData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete listing
export const deleteListing = createAsyncThunk(
  'listings/delete',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/listings/${id}`);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const listingSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentListing: (state) => {
      state.currentListing = null;
    }
  },
  extraReducers: (builder) => {
    // Get all listings
    builder
      .addCase(getAllListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.listings;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getAllListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get single listing
    builder
      .addCase(getListingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentListing = action.payload.listing;
      })
      .addCase(getListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get my listings
    builder
      .addCase(getMyListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings = action.payload.listings;
      })
      .addCase(getMyListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create listing
    builder
      .addCase(createListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings.unshift(action.payload.listing);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete listing
    builder
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.myListings = state.myListings.filter(
          (listing) => listing._id !== action.payload.id
        );
      });
  }
});

export const { clearError, clearCurrentListing } = listingSlice.actions;
export default listingSlice.reducer;