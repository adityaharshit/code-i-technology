// Enhanced Futuristic Email Verification Page
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { authAPI } from "../services/auth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Shield,
  Zap,
  Sparkles,
  Clock,
  Home,
} from "lucide-react";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error', 'no-token'
  const [message, setMessage] = useState("Verifying your email...");
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsVisible(true);
    const token = new URLSearchParams(location.search).get("token");

    if (token) {
      authAPI
        .verifyEmail(token)
        .then(() => {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in.");
        })
        .catch(() => {
          setStatus("error");
          setMessage("Invalid or expired verification token.");
        });
    } else {
      setStatus("no-token");
      setMessage("No verification token found.");
    }
  }, [location]);

  const getStatusIcon = () => {
    switch (status) {
      case "verifying":
        return <LoadingSpinner className="w-12 h-12 text-electric-400" />;
      case "success":
        return (
          <CheckCircle className="w-12 h-12 text-green-400 " />
        );
      case "error":
        return <XCircle className="w-12 h-12 text-red-400 animate-pulse" />;
      case "no-token":
        return (
          <AlertTriangle className="w-12 h-12 text-yellow-400 animate-pulse" />
        );
      default:
        return <Mail className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verifying":
        return "electric";
      case "success":
        return "matrix";
      case "error":
        return "neural";
      case "no-token":
        return "cyber";
      default:
        return "hologram";
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "verifying":
        return {
          title: "Verifying Your Email",
          subtitle: "Please wait while we confirm your email address...",
          description: "This process usually takes just a few seconds.",
        };
      case "success":
        return {
          title: "Email Verified Successfully!",
          subtitle:
            "Your email has been confirmed and your account is now active.",
          description: "You can now access all features of our platform.",
        };
      case "error":
        return {
          title: "Verification Failed",
          subtitle: "We couldn't verify your email address.",
          description: "The verification link may have expired or is invalid.",
        };
      case "no-token":
        return {
          title: "No Verification Token",
          subtitle: "No verification token was found in the URL.",
          description:
            "Please check your email for the correct verification link.",
        };
      default:
        return {
          title: "Email Verification",
          subtitle: "Processing your request...",
          description: "",
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Mail
          className="absolute top-20 left-10 w-4 h-4 text-electric-500/20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Shield
          className="absolute top-32 right-16 w-3 h-3 text-cyber-500/20 animate-particle-float"
          style={{ animationDelay: "2s" }}
        />
        <CheckCircle
          className="absolute bottom-32 left-20 w-5 h-5 text-matrix-500/20 animate-neural-pulse"
          style={{ animationDelay: "1s" }}
        />
        <Zap
          className="absolute bottom-20 right-12 w-4 h-4 text-neural-500/20 "
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        {/* Main Verification Card */}
        <Card
          variant={getStatusColor()}
          className={`p-8 sm:p-12 text-center ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="space-y-8">
            {/* Status Icon */}
            <div className="relative">
              <div className="flex justify-center">{getStatusIcon()}</div>

              {/* Floating indicators based on status */}
              {status === "success" && (
                <>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full " />
                  <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-green-400 rounded-full animate-particle-float" />
                </>
              )}

              {status === "verifying" && (
                <>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-electric-400 rounded-full animate-pulse" />
                  <div
                    className="absolute -bottom-1 -left-2 w-2 h-2 bg-electric-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                </>
              )}
            </div>

            {/* Status Content */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white animate-fade-in-up animate-delay-300">
                {statusInfo.title}
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 animate-fade-in-up animate-delay-400">
                {statusInfo.subtitle}
              </p>

              {statusInfo.description && (
                <p className="text-gray-400 animate-fade-in-up animate-delay-500">
                  {statusInfo.description}
                </p>
              )}
            </div>

            {/* Progress indicator for verifying state */}
            {status === "verifying" && (
              <div className="space-y-4 animate-fade-in-up animate-delay-600">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4 text-electric-400 animate-pulse" />
                  <span className="text-sm text-gray-400">
                    Processing verification...
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-electric-400 to-cyber-500 h-2 rounded-full animate-progress-fill"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-700">
          {status === "success" && (
            <Link to="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 group"
            >
              <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Continue to Login
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            </Link>
          )}

          {(status === "error" || status === "no-token") && (
            <>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="lg"
                className="group"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </Button>

              <Button
                as={Link}
                to="/register"
                size="lg"
                className="bg-gradient-to-r from-cyber-500 to-electric-500 hover:from-electric-500 hover:to-matrix-500 group"
              >
                <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Resend Email
              </Button>
            </>
          )}

          <Link to="/" className="w-full sm:w-auto">
                              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                Go Home
                              </Button>
                            </Link>

          {/* <Button
            as={Link}
            to="/"
            variant="outline"
            size="lg"
            className="group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Go Home
          </Button> */}
        </div>

        {/* Help Section */}
        {(status === "error" || status === "no-token") && (
          <Card
            variant="neural"
            className="p-6 sm:p-8 animate-fade-in-up animate-delay-800"
          >
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="p-4 bg-neural-500/20 rounded-2xl">
                <Sparkles className="w-8 h-8 text-neural-400 " />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Need Help?
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  If you're having trouble with email verification, our support
                  team can assist you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="text-neural-400 hover:text-neural-300 text-sm font-medium hover:underline transition-colors duration-300"
                  >
                    Contact Support
                  </Link>
                  <span className="hidden sm:inline text-gray-600">•</span>
                  <Link
                    to="/register"
                    className="text-neural-400 hover:text-neural-300 text-sm font-medium hover:underline transition-colors duration-300"
                  >
                    Create New Account
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Security Notice */}
        <Card
          variant="hologram"
          className="p-4 sm:p-6 animate-fade-in-up animate-delay-900"
        >
          <div className="flex items-center justify-center space-x-3">
            <Shield className="w-5 h-5 text-gray-400" />
            <p className="text-gray-400 text-sm text-center">
              🔒 Your email verification is secured with industry-standard
              encryption
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
