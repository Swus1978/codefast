"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";


const FormNewBoard = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        try {
            const data = await axios.post("/api/board", { name });
            setName("");
            toast.success("Board created successfully");
            router.refresh();
            
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Something went wrong. Please try again.";

            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <form
            className="bg-base-100 p-8 rounded-3xl space-y-8"
            onSubmit={handleSubmit}
        >
            <p className="font-bold text-lg">Create a new feedback board</p>
            <label className="form-control w-full">
                <span className="lable-text">Board Name</span>
                <input
                    required
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Type here"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
            </label>
            <button className="btn btn-primary w-full" type="submit">
                {isLoading && (
                    <span className="loading loading-spinner loading-xs"></span>
                )}
                Create Board
            </button>
        </form>
    );

};
export default FormNewBoard;