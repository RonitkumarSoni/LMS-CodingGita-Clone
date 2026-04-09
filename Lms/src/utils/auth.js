const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const isDemoAuthEnabled = import.meta.env.VITE_ENABLE_DEMO_AUTH !== "false";

const demoCredentials = {
  uid: "108428",
  email: "ronitsoni@gmail.com",
  password: "123456",
  role: "Student",
};

const defaultAttendance = {
  semester: "Semester 1",
  present: 0,
  total: 0,
  bonus: 0,
  percentLabel: 0,
  startDate: "-",
  endDate: "-",
};

const normalizeUser = (user) => ({
  _id: user._id || "",
  uid: user.uid || "",
  role: user.role || "Student",
  name: user.name || "Student",
  email: user.email || "",
  mobile: user.mobile || "",
  university: user.university || "N/A",
  image: user.image || "",
  attendance: {
    ...defaultAttendance,
    ...(user.attendance || {}),
  },
  subjects: Array.isArray(user.subjects) ? user.subjects : [],
  mentors: Array.isArray(user.mentors) ? user.mentors : [],
  assignments: Number.isFinite(user.assignments) ? user.assignments : 0,
  pendingAssignments: Number.isFinite(user.pendingAssignments)
    ? user.pendingAssignments
    : 0,
  events: Array.isArray(user.events) ? user.events : [],
});

const demoUser = normalizeUser({
  _id: "demo-student",
  uid: demoCredentials.uid,
  role: demoCredentials.role,
  name: "Ronit Soni",
  email: demoCredentials.email,
  mobile: "9999999991",
  university: "SUxCG 712",
  image: "",
  attendance: {
    semester: "Semester 2",
    present: 126,
    total: 146,
    bonus: 2,
    percentLabel: 88,
    startDate: "29/01/2026",
    endDate: "30/06/2026",
  },
  subjects: [
    "SU11 - GIT & GITHUB",
    "SU12 - C Language",
    "SU13 - HTML/CSS/JS",
    "SU14 - UI/UX FIGMA",
    "SU15 - MATHS",
    "SU16 - JavaScript",
    "SU0201 - ReactJS",
    "SU0202 - NodeJS",
    "SU0203 - NoSQL",
    "SU0204 - OOPS",
    "SU0205 - Maths 2",
    "SU0206 - EVS",
    "SU0207 - IR 01",
    "SU0208 - IR 02",
  ],
  mentors: [{ name: "Ankita", batch: "SUxCG 712" }],
  assignments: 0,
  pendingAssignments: 0,
  events: [],
});

const getErrorMessage = (fallbackMessage, payload) => {
  if (payload && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return fallbackMessage;
};

const tryDemoLogin = (identifier, password, role) => {
  if (!isDemoAuthEnabled) {
    return null;
  }

  const normalizedIdentifier = String(identifier || "")
    .trim()
    .toLowerCase();
  const normalizedRole = String(role || "").trim();

  const matchesIdentifier =
    normalizedIdentifier === demoCredentials.uid.toLowerCase() ||
    normalizedIdentifier === demoCredentials.email.toLowerCase();

  const matchesPassword = password === demoCredentials.password;
  const matchesRole = !normalizedRole || normalizedRole === demoCredentials.role;

  if (!matchesIdentifier || !matchesPassword || !matchesRole) {
    return null;
  }

  localStorage.setItem("user", JSON.stringify(demoUser));
  localStorage.setItem("token", "demo-local-token");

  return {
    success: true,
    user: demoUser,
  };
};

export const loginDetails = async (identifier, password, role = "Student") => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password, role }),
    });

    const payload = await response.json().catch(() => ({}));
    const hasUserPayload =
      payload &&
      typeof payload === "object" &&
      payload.user &&
      typeof payload.user === "object";

    if (!response.ok || !hasUserPayload) {
      const demoResult = tryDemoLogin(identifier, password, role);
      if (demoResult) {
        return demoResult;
      }

      return {
        success: false,
        message: getErrorMessage("Login failed. Please try again.", payload),
      };
    }

    const normalizedUser = normalizeUser(payload.user || {});

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    if (payload.token) {
      localStorage.setItem("token", payload.token);
    }

    return {
      success: true,
      user: normalizedUser,
    };
  } catch (error) {
    const demoResult = tryDemoLogin(identifier, password, role);
    if (demoResult) {
      return demoResult;
    }

    return {
      success: false,
      message:
        "Unable to reach authentication server. You can still use demo UID 108428 and password 123456.",
    };
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
