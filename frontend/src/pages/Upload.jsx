import { useState } from "react";
import axios from "axios";
import { FileText, Upload as UploadIcon, ArrowRight } from "lucide-react";

export default function Upload({ onTabChange }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [processed, setProcessed] = useState(0);
    const [total, setTotal] = useState(0);
    const [done, setDone] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [temporary, setTemporary] = useState(true); // ⬅️ new toggle state

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.name.endsWith(".zip")) {
            setFile(droppedFile);
            setStatus(`✅ Selected: ${droppedFile.name}`);
        } else {
            setStatus("❗ Only .zip files are accepted.");
        }
    };

    const handleUpload = async () => {
        if (!file) return setStatus("❗ Please select a ZIP file first.");

        setStatus("Uploading...");
        setProcessed(0);
        setDone(false);

        const formData = new FormData();
        formData.append("zipfile", file);

        try {
            const res = await axios.post(
                `http://localhost:8000/upload-resumes?temporary=${temporary}`,
                formData
            );
            const jobId = res.data.job_id;
            setTotal(res.data.total || 0);

            // Poll progress
            const interval = setInterval(async () => {
                try {
                    const progress = await axios.get(`http://localhost:8000/upload-status/${jobId}`);
                    setProcessed(progress.data.processed);
                    setTotal(progress.data.total);
                    if (progress.data.status === "done" || progress.data.processed === progress.data.total) {
                        clearInterval(interval);
                        setDone(true);
                        setStatus("✅ Processing complete!");
                    }
                } catch (err) {
                    console.error("Polling failed:", err);
                    clearInterval(interval);
                    setStatus("❌ Failed to fetch upload status.");
                }
            }, 1000);
        } catch (err) {
            setStatus("❌ Upload failed.");
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <UploadIcon className="w-7 h-7 text-blue-600" />
                Upload Resume Zip
            </h2>

            {/* Temporary vs Permanent Toggle */}
            <div className="flex flex-col gap-3 mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        name="storageMode"
                        checked={temporary}
                        onChange={() => setTemporary(true)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-800 font-medium text-base">
                        Store Temporarily <span className="text-sm text-gray-500">(Everytime File is uploaded, Existing data is replaced)(auto-deletes in 24h)</span>
                    </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        name="storageMode"
                        checked={!temporary}
                        onChange={() => setTemporary(false)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-800 font-medium text-base">Store Permanently(Add to Existing Database)</span>
                </label>
            </div>


            {/* Drag and Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                }}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors duration-300 ${dragActive ? "border-blue-600 bg-blue-100/60" : "border-blue-400 bg-blue-50/50"
                    }`}
            >
                <FileText className="w-10 h-10 text-blue-500 mb-2" />
                <p className="text-gray-700 font-medium mb-2">
                    Drag and drop or click to upload a ZIP file
                </p>
                <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => {
                        const selected = e.target.files[0];
                        setFile(selected);
                        setStatus(`✅ Selected: ${selected.name}`);
                    }}
                    className="mt-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-100 file:text-blue-700
                     hover:file:bg-blue-200"
                />
                {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={handleUpload}
                    disabled={status === "Uploading..."}
                    className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${status === "Uploading..." ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    {status === "Uploading..." ? "Uploading..." : "Upload"}
                </button>

                <button
                    onClick={() => onTabChange("Job Description")}
                    className="border border-blue-500 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition duration-200"
                >
                    Go to Job Description
                </button>
            </div>

            {/* Progress Display */}
            {status && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow-sm text-gray-700 space-y-2">
                    <p>{status}</p>
                    {total > 0 && (
                        <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                            <div
                                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${(processed / total) * 100}%` }}
                            />
                        </div>
                    )}
                    {total > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            Processed {processed} of {total} resumes
                        </p>
                    )}
                </div>
            )}

            {/* Completion Button */}
            {done && (
                <div className="mt-6">
                    <button
                        onClick={() => onTabChange("Job Description")}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
                    >
                        Continue to Job Description <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
