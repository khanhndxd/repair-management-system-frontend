import { baseApi } from "../baseApi";

const pdfApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    generatePdf: build.mutation({
      query: (body) => ({
        url: "/Pdf/Generate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGeneratePdfMutation } = pdfApi;
