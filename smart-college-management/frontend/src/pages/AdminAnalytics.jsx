import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./AdminAnalytics.css";

const API =
  "https://smart-college-management-api-1870.onrender.com/api/analytics";
const AI_API =
  "https://smart-college-management-api-1870.onrender.com/api/ai-placement";

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("authToken");
}

function StatCard({ icon, title, value }) {
  return (
    <div className="analytics-stat-card">
      <div className="analytics-stat-icon">{icon}</div>
      <h3>{title}</h3>
      <div className="analytics-stat-value">{value ?? 0}</div>
      <p>Live dashboard statistics</p>
    </div>
  );
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalPlacements: 0,
    totalApplications: 0,
    appliedApplications: 0,
    underReviewApplications: 0,
    shortlistedApplications: 0,
    selectedApplications: 0,
    rejectedApplications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [aiInsights, setAiInsights] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const loadAnalytics = useCallback(async (manual = false) => {
    if (manual) {
      setRefreshing(true);
    }

    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in again as admin.");
      }

      const response = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load analytics.");
      }

      // Supports analytics returned directly or inside stats.
      const source = data.stats || data.analytics || data;

      setStats((previous) => ({
        ...previous,
        ...source,
      }));

      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately without calling a state-setting helper
    // synchronously inside the effect.
    const controller = new AbortController();

    async function fetchInitialAnalytics() {
      setError("");

      try {
        const token = getToken();

        if (!token) {
          throw new Error("Please log in again as admin.");
        }

        const response = await fetch(API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load analytics.");
        }

        const source = data.stats || data.analytics || data;

        setStats((previous) => ({
          ...previous,
          ...source,
        }));

        setLastUpdated(new Date());
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load analytics.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchInitialAnalytics();

    const intervalId = setInterval(() => {
      loadAnalytics();
    }, 30000);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [loadAnalytics]);

  const generateAIInsights = async () => {
    setAiLoading(true);
    setAiError("");
    setAiInsights("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in again as admin.");
      }

      const response = await fetch(AI_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to generate AI report.");
      }

      setAiInsights(data.insights || "No analysis was returned by Gemini.");
    } catch (err) {
      setAiError(err.message || "AI analysis failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const applicationStatuses = [
    {
      name: "Applied",
      value: Number(stats.appliedApplications ?? stats.applied ?? 0),
    },
    {
      name: "Under Review",
      value: Number(stats.underReviewApplications ?? stats.underReview ?? 0),
    },
    {
      name: "Shortlisted",
      value: Number(stats.shortlistedApplications ?? stats.shortlisted ?? 0),
    },
    {
      name: "Selected",
      value: Number(stats.selectedApplications ?? stats.selected ?? 0),
    },
    {
      name: "Rejected",
      value: Number(stats.rejectedApplications ?? stats.rejected ?? 0),
    },
  ];

  const totalApplications = Number(
    stats.totalApplications ?? stats.totalApplicationsCount ?? 0,
  );

  const chartData = applicationStatuses.map((item) => ({
    status: item.name,
    applications: item.value,
  }));

  const percentage = (value) =>
    totalApplications > 0
      ? ((value / totalApplications) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div>
          <p className="analytics-eyebrow">ADMINISTRATION</p>
          <h1>Analytics Dashboard</h1>
          <p>Track college activity and placement performance in one place.</p>
        </div>

        <div className="analytics-header-actions">
          <button
            type="button"
            className="analytics-secondary-button"
            onClick={() => loadAnalytics(true)}
            disabled={refreshing || loading}
          >
            {refreshing ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      <div className="analytics-update-info">
        <span>Auto-refresh every 30 seconds</span>
        <span>
          Last updated:{" "}
          {lastUpdated ? lastUpdated.toLocaleTimeString() : "Not yet updated"}
        </span>
      </div>

      {error && (
        <div className="analytics-error" role="alert">
          {error}
          <button type="button" onClick={() => loadAnalytics(true)}>
            Try again
          </button>
        </div>
      )}

      <section className="analytics-section">
        <div className="analytics-section-heading">
          <h2>College Overview</h2>
          <p>Your key statistics at a glance</p>
        </div>

        {loading ? (
          <p>Loading college statistics...</p>
        ) : (
          <div className="analytics-stats-grid">
            <StatCard
              icon="🎓"
              title="Total Students"
              value={stats.totalStudents}
            />
            <StatCard
              icon="👨‍🏫"
              title="Total Faculty"
              value={stats.totalFaculty}
            />
            <StatCard
              icon="💼"
              title="Placements"
              value={stats.totalPlacements}
            />
            <StatCard
              icon="📄"
              title="Applications"
              value={totalApplications}
            />
          </div>
        )}
      </section>

      <section className="analytics-section">
        <div className="analytics-section-heading">
          <h2>Application Status</h2>
          <p>Placement application progress by status</p>
        </div>

        <div className="analytics-status-grid">
          {applicationStatuses.map((item) => (
            <div className="analytics-status-card" key={item.name}>
              <span>{item.name}</span>
              <strong>{item.value}</strong>
              <p>{percentage(item.value)}% of applications</p>
            </div>
          ))}
        </div>
      </section>

      <section className="analytics-section">
        <div className="analytics-section-heading">
          <h2>Application Status Overview</h2>
          <p>Compare placement applications by status.</p>
        </div>

        <div className="analytics-chart-card">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="applications"
                fill="#4f46e5"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="analytics-section ai-placement-section">
        <div className="ai-placement-heading">
          <span className="ai-placement-badge">AI POWERED</span>
          <h2>🤖 AI Placement Analyst</h2>
          <p>
            Get an AI-generated report and practical placement improvement
            recommendations using college statistics.
          </p>
        </div>

        <button
          type="button"
          className="ai-generate-button"
          onClick={generateAIInsights}
          disabled={aiLoading}
        >
          {aiLoading ? "Analyzing..." : "✨ Generate AI Insights"}
        </button>

        {aiLoading && (
          <div className="ai-loading-message" role="status">
            <span className="ai-spinner" />
            <div>
              <strong>AI is analyzing placement statistics.</strong>
              <p>Please wait while Gemini prepares your report.</p>
            </div>
          </div>
        )}

        {aiError && (
          <div className="analytics-error" role="alert">
            <strong>AI analysis failed:</strong> {aiError}
            <button
              type="button"
              onClick={generateAIInsights}
              disabled={aiLoading}
            >
              Try again
            </button>
          </div>
        )}

        {aiInsights && (
          <div className="ai-report-card">
            <div className="ai-report-title">
              <span>📊</span>
              <div>
                <h3>Placement Analysis Report</h3>
                <p>AI-generated insights and recommendations</p>
              </div>
            </div>

            <div className="ai-markdown">
              <ReactMarkdown>
                {aiInsights.replace(/\\([*#_`])/g, "$1")}
              </ReactMarkdown>
            </div>

            <div className="ai-report-footer">
              Generated from the available college placement statistics.
            </div>
          </div>
        )}
      </section>

      <footer className="analytics-footer">
        Smart College Management System · Analytics updates automatically
      </footer>
    </div>
  );
}
