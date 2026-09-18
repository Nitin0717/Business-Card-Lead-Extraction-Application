# Leadforge — Business Card Lead Extraction

A polished Next.js interface for bulk business-card ingestion, structured lead review, and Excel export. The current preview includes representative extracted leads and a fully functional upload/progress/export flow. It is intentionally not deployed, per the assignment request.

## Public URL

Run locally with `pnpm install` and `pnpm dev`.

## Architecture

- **Frontend:** Next.js 16 App Router, React 19, Tailwind CSS v4, lucide-react.
- **Upload workflow:** Client-side multi-file image selection and drag/drop. The UI validates image MIME types and shows per-batch progress.
- **VLM service (deployment target):** A lightweight FastAPI service on AWS EC2 or SageMaker would receive images through a private API endpoint, run Qwen2.5-VL 7B, and return strict JSON matching the lead schema. The Next.js route handler would proxy requests so model credentials and infrastructure details remain server-side.
- **Export:** `xlsx` generates a workbook named `leadforge-business-card-leads.xlsx` with the required seven columns.
## Lead schema

`firstName`, `lastName`, `title`, `company`, `location`, `phone`, and `email`. The model prompt should request JSON only, use empty strings for missing values, and preserve phone/email text exactly as detected.

## Local setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Deployment instructions

1. Deploy the Next.js app to Vercel or an equivalent Node host.
2. Deploy the VLM API as a FastAPI container to AWS. Add image size limits, authentication, request timeouts, and rate limiting.
3. Configure the server-side API URL as `VLM_API_URL`.
4. In the app route handler, send multipart images to the VLM service and validate the response with a schema validator before rendering/exporting.
5. Keep uploaded images ephemeral unless the product explicitly requires storage; use private object storage if persistence is needed.

## Libraries, models, and external components

- Next.js 16, React 19, Tailwind CSS v4
- lucide-react for interface icons
- xlsx for Excel workbook generation
- Qwen2.5-VL 7B Instruct (planned inference model)
- AWS EC2/SageMaker and FastAPI (planned inference deployment)

## Known limitations / future improvements

- The preview uses representative sample leads so the interface can be reviewed without an AWS model deployment.
- Upload processing is currently a local demo simulation; it does not call Qwen until the server route and `VLM_API_URL` are wired.
- Add OCR confidence per field, manual inline editing, duplicate detection, retries, authentication, virus scanning, signed uploads, queue-based processing, and observability.
- Benchmark batch throughput on the selected AWS instance and use a quantized model if memory or cost is constrained.

## AI Usage

- **Tools used:** v0 / ChatGPT-assisted development.
- **Used for:** UI composition, component structure, accessibility-minded interaction patterns, export workflow, and README architecture draft.
- **Adopted:** A responsive dashboard layout, semantic lead schema, bulk drag/drop flow, and client-generated Excel export.
- **Modified or rejected:** I did not claim a live AWS deployment or real VLM inference in the preview because the assignment explicitly requested no deployment. The final production architecture keeps inference server-side rather than exposing model credentials in the browser.

## Test environment and measured processing time

The interface was designed for Chrome/Edge desktop and responsive mobile widths. In this preview, the displayed benchmark is representative UI data (`1.8s/card`); it is not a measured AWS inference result. A valid Assignment 2 measurement should record batch size, image dimensions, instance type, model quantization, cold/warm state, total wall-clock time, and per-card average from the deployed inference service.
