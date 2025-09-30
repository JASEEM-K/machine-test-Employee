import { Eye, EyeClosed, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { type LoginErrors, validateForm } from "../lib/validation";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../provider/authProvider";
import { useNavigate } from "react-router-dom";

type FormType = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState<FormType>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<LoginErrors>({
        emailError: null,
        passwordError: null,
    });
    const [show, setShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        const loginErrors = validateForm("login", form);
        setError(loginErrors);
        const hasErrors = Object.values(loginErrors).some(
            (err) => err !== null
        );
        if (!hasErrors) {
            setLoading(true);
            try {
                const response = await axiosInstance.post("/login", form);
                console.log("Login response:", response.data);
                const userData = {
                    ...response.data.user,
                    token: response.data.token,
                };
                console.log("Setting user data:", userData);
                setUser(userData);
                // Navigation will happen automatically due to route protection
            } catch (err: any) {
                console.error("Login error:", err);
                // Handle login error - could set a general error state here
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="authpage-body">
            <div className="authpage-style">
                <div className="text-white flex flex-col gap-2 items-center justify-center ">
                    <h1 className="text-5xl font-bold ">Login</h1>
                    <p className="font-semibold">Welcom back!</p>
                </div>

                <div>
                    <div
                        className={`input-style   ${
                            error.emailError !== null
                                ? "border-red-500/80"
                                : "border-slate-200/50"
                        }`}
                    >
                        <Mail />
                        <input
                            type="email"
                            value={form.email}
                            placeholder="Email"
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    email: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <p className="text-sm font-semibold text-red-500">
                        {error.emailError}
                    </p>
                </div>

                <div>
                    <div
                        className={`input-style   ${
                            error.passwordError !== null
                                ? "border-red-500/80"
                                : "border-slate-200/50"
                        }`}
                    >
                        <KeyRound />
                        <input
                            type={show ? "text" : "password"}
                            value={form.password}
                            placeholder="Password"
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    password: e.target.value,
                                }))
                            }
                        />
                        {show ? (
                            <Eye
                                className="cursor-pointer"
                                onClick={() => {
                                    setShow(false);
                                }}
                            />
                        ) : (
                            <EyeClosed
                                className="cursor-pointer"
                                onClick={() => {
                                    setShow(true);
                                }}
                            />
                        )}
                    </div>
                    <p className="text-sm font-semibold text-red-500">
                        {error.passwordError}
                    </p>
                </div>

                <button
                    className="authpage-submit disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Submit"}
                </button>

                <div className="text-center">
                    <p className="text-gray-400">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/register")}
                            className="text-purple-400 hover:text-purple-300 underline"
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
