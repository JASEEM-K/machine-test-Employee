import React, { useState, useEffect } from "react";
import { Plus, Building, LogOut, Trash2, Eye } from "lucide-react";
import { useAuth } from "../provider/authProvider";
import { axiosInstance } from "../lib/axios";
import { validateForm, type DepartmentErrors } from "../lib/validation";

type Department = {
    _id: string;
    dept_name: string;
    description: string;
    createdAt: string;
};

type DepartmentFormData = {
    dept_name: string;
    description: string;
};

const HomePage = () => {
    const { user, logout } = useAuth();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);
    const [formData, setFormData] = useState<DepartmentFormData>({
        dept_name: "",
        description: "",
    });
    const [errors, setErrors] = useState<DepartmentErrors>({
        deptNameError: null,
        descriptionError: null,
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch departments
    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/departments");
            setDepartments(response.data.departments || response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            setLoading(false);
        }
    };

    // Add department
    const handleAddDepartment = async () => {
        const validationErrors = validateForm("department", formData);
        setErrors(validationErrors);

        const hasErrors = Object.values(validationErrors).some(
            (err) => err !== null
        );
        if (hasErrors) return;

        try {
            setSubmitting(true);
            await axiosInstance.post("/add-department", formData);
            setFormData({ dept_name: "", description: "" });
            setShowAddForm(false);
            fetchDepartments();
        } catch (error) {
            console.error("Error adding department:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete department
    const handleDeleteDepartment = async (deptId: string) => {
        if (!confirm("Are you sure you want to delete this department?"))
            return;

        try {
            await axiosInstance.delete(`/delete-department/${deptId}`);
            fetchDepartments();
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    // Get single department
    const handleViewDepartment = async (deptId: string) => {
        try {
            const response = await axiosInstance.get(`/department/${deptId}`);
            setSelectedDepartment(response.data.department || response.data);
        } catch (error) {
            console.error("Error fetching department:", error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#28282B] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#28282B] text-white">
            {/* Header */}
            <header className="bg-gray-800 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Building className="text-purple-400" size={28} />
                    <h1 className="text-2xl font-bold">
                        Department Management
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300">Welcome, {user?.name}</span>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </header>

            <div className="container mx-auto p-6">
                {/* Add Department Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Add Department
                    </button>
                </div>

                {/* Add Department Form */}
                {showAddForm && (
                    <div className="bg-gray-800 p-6 rounded-lg mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Add New Department
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <div
                                    className={`input-style ${
                                        errors.deptNameError
                                            ? "border-red-500/80"
                                            : "border-slate-200/50"
                                    }`}
                                >
                                    <Building />
                                    <input
                                        type="text"
                                        placeholder="Department Name"
                                        value={formData.dept_name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                dept_name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                {errors.deptNameError && (
                                    <p className="text-sm font-semibold text-red-500 mt-1">
                                        {errors.deptNameError}
                                    </p>
                                )}
                            </div>

                            <div>
                                <div
                                    className={`input-style ${
                                        errors.descriptionError
                                            ? "border-red-500/80"
                                            : "border-slate-200/50"
                                    }`}
                                >
                                    <textarea
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        className="w-full h-20 bg-transparent outline-none resize-none"
                                    />
                                </div>
                                {errors.descriptionError && (
                                    <p className="text-sm font-semibold text-red-500 mt-1">
                                        {errors.descriptionError}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddDepartment}
                                    disabled={submitting}
                                    className="authpage-submit disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Adding..."
                                        : "Add Department"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setFormData({
                                            dept_name: "",
                                            description: "",
                                        });
                                        setErrors({
                                            deptNameError: null,
                                            descriptionError: null,
                                        });
                                    }}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Departments List */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departments.map((dept) => (
                        <div
                            key={dept._id}
                            className="bg-gray-800 p-6 rounded-lg"
                        >
                            <h3 className="text-xl font-semibold mb-2 text-purple-400">
                                {dept.dept_name}
                            </h3>
                            <p className="text-gray-300 mb-4 line-clamp-3">
                                {dept.description}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Created:{" "}
                                {new Date(dept.createdAt).toLocaleDateString()}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleViewDepartment(dept._id)
                                    }
                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                                >
                                    <Eye size={14} />
                                    View
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteDepartment(dept._id)
                                    }
                                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {departments.length === 0 && (
                    <div className="text-center py-12">
                        <Building
                            className="mx-auto text-gray-600 mb-4"
                            size={64}
                        />
                        <p className="text-gray-400 text-lg">
                            No departments found
                        </p>
                        <p className="text-gray-500">
                            Add your first department to get started
                        </p>
                    </div>
                )}
            </div>

            {/* Department Details Modal */}
            {selectedDepartment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">
                            {selectedDepartment.dept_name}
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-400">
                                    Description:
                                </label>
                                <p className="text-white">
                                    {selectedDepartment.description}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400">
                                    Created At:
                                </label>
                                <p className="text-white">
                                    {new Date(
                                        selectedDepartment.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400">
                                    Department ID:
                                </label>
                                <p className="text-white font-mono text-sm">
                                    {selectedDepartment._id}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedDepartment(null)}
                            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
