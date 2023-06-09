import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import xmlService from "../services/xmlService";

const initialState = {
    xmls: [],
    xml: {},
    error: false,
    success: false,
    loading: false,
    message: null,
};

export const xmlUpload = createAsyncThunk(
    "xml/upload",
    async (xml, thunkAPI) => {

        const data = await xmlService.uploadoXml(xml);

        // console.log(data.errors);

        // Check for errors
        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors);
        }

        return data;
    }
);

export const xmlValidar = createAsyncThunk(
    "xml/validar",
    async (xml, thunkAPI) => {

        const data = await xmlService.validarXml(xml);

        console.log(data);

        // Check for errors
        if (data.errors) {
            return thunkAPI.rejectWithValue(data.errors);
        }

        return data;
    }
);

export const getXml = createAsyncThunk("xml/getallxml", async () => {
    const data = await xmlService.getXml();

    return data;
});

export const deleteXml = createAsyncThunk(
    "xml/deletexml", 
    async (id, thunkAPI) => {
    const data = await xmlService.deleteXml(id);

    if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors)
    }

    return data;
});

export const xmlSlice = createSlice({
    name: "upload",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
            state.success = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(xmlUpload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(xmlUpload.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.xml = action.payload;
                state.xmls.unshift(state.xml);
                state.message = "Arquivo XML enviado com sucesso para o servidor";
            })
            .addCase(xmlUpload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.xml = null;
            })
            .addCase(getXml.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getXml.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.xmls = action.payload;
            })
            .addCase(deleteXml.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteXml.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;

                state.xmls = state.xmls.filter((xml) => {
                    return xml._id !== action.payload.id;
                });

                state.message = action.payload.message;
            })
            .addCase(deleteXml.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.xml = null;
            })
            .addCase(xmlValidar.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(xmlValidar.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.xml = action.payload;
                state.xmls.unshift(state.xml);
                state.message = "Arquivo XML Válido: Enviado com sucesso para o servidor";
            })
            .addCase(xmlValidar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.xml = null;
                state.message = "Arquivo XML Inválido: verifique os erros e envie novamente";
            })
    },
})


export const { resetMessage } = xmlSlice.actions;
export default xmlSlice.reducer;