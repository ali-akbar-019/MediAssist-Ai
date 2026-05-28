import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Stethoscope } from "lucide-react";
import { Button } from "../components/ui/button";
import { ROUTES } from "../constants";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                {/* Icon */}
                <motion.div
                    animate={{ float: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-navy-50 border border-navy-100 mb-6"
                >
                    <Stethoscope className="w-10 h-10 text-navy-900" />
                </motion.div>

                {/* 404 */}
                <h1 className="text-8xl font-heading font-bold text-navy-900 mb-2">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl font-heading font-semibold text-navy-900 mb-3">
                    Page Not Found
                </h2>
                <p className="text-medical-muted mb-8 leading-relaxed">
                    Oops! The page you are looking for does not exist or has been moved.
                    Let us get you back on track.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="border-medical-border text-medical-muted hover:text-navy-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                    <Button
                        onClick={() => navigate(ROUTES.HOME)}
                        className="bg-navy-900 hover:bg-navy-800 text-white shadow-navy"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;