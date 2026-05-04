import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import { applyTheme, getInitialTheme } from "../theme/applyTheme";
import type { ThemeMode } from "../theme/tokens";
import {
    mockAlerts,
    mockBloodBanks,
    mockDonations,
    mockLeaderboardBanks,
    mockLeaderboardIndividuals,
    mockRequests,
    mockUsers,
} from "../data/mock";
import type {
    Alert,
    BloodBank,
    Donation,
    LeaderboardEntry,
    Request,
    User,
} from "../data/types";
type State = {
    theme: ThemeMode;
    users: User[];
    requests: Request[];
    donations: Donation[];
    alerts: Alert[];
    bloodBanks: BloodBank[];
    leaderboardIndividuals: LeaderboardEntry[];
    leaderboardBanks: LeaderboardEntry[];
};

type Action =
    | { type: "theme/toggle" }
    | { type: "users/flag"; id: string; value?: boolean }
    | { type: "requests/setStatus"; id: string; status: Request["status"] }
    | { type: "donations/setStatus"; id: string; status: Donation["status"] }
    | { type: "donations/adjustTokens"; id: string; tokens: number }
    | { type: "alerts/markNotified"; id: string }
    | { type: "bloodBanks/create"; bank: BloodBank }
    | { type: "bloodBanks/update"; bank: BloodBank }
    | { type: "bloodBanks/delete"; id: string };

const initialTheme: ThemeMode =
    typeof window !== "undefined" ? getInitialTheme() : "light";

const initialState: State = {
    theme: initialTheme,
    users: mockUsers,
    requests: mockRequests,
    donations: mockDonations,
    alerts: mockAlerts,
    bloodBanks: mockBloodBanks,
    leaderboardIndividuals: mockLeaderboardIndividuals,
    leaderboardBanks: mockLeaderboardBanks,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "theme/toggle": {
            const theme: ThemeMode = state.theme === "dark" ? "light" : "dark";
            return { ...state, theme };
        }

        case "users/flag":
            return {
                ...state,
                users: state.users.map((u) =>
                    u.id === action.id
                        ? { ...u, isFlagged: action.value ?? !u.isFlagged }
                        : u,
                ),
            };

        case "requests/setStatus":
            return {
                ...state,
                requests: state.requests.map((r) =>
                    r.id === action.id ? { ...r, status: action.status } : r,
                ),
            };

        case "donations/setStatus":
            return {
                ...state,
                donations: state.donations.map((d) =>
                    d.id === action.id ? { ...d, status: action.status } : d,
                ),
            };

        case "donations/adjustTokens":
            return {
                ...state,
                donations: state.donations.map((d) =>
                    d.id === action.id ? { ...d, tokens: action.tokens } : d,
                ),
            };

        case "alerts/markNotified":
            return {
                ...state,
                alerts: state.alerts.map((a) =>
                    a.id === action.id ? { ...a, notified: true } : a,
                ),
            };

        case "bloodBanks/create":
            return {
                ...state,
                bloodBanks: [action.bank, ...state.bloodBanks],
            };

        case "bloodBanks/update":
            return {
                ...state,
                bloodBanks: state.bloodBanks.map((b) =>
                    b.id === action.bank.id ? action.bank : b,
                ),
            };

        case "bloodBanks/delete":
            return {
                ...state,
                bloodBanks: state.bloodBanks.filter((b) => b.id !== action.id),
            };

        default:
            return state;
    }
}

type Store = {
    state: State;
    dispatch: React.Dispatch<Action>;
    actions: {
        toggleTheme: () => void;
        flagUser: (id: string, value?: boolean) => void;
        setRequestStatus: (id: string, status: Request["status"]) => void;
        setDonationStatus: (id: string, status: Donation["status"]) => void;
        adjustDonationTokens: (id: string, tokens: number) => void;
        markAlertNotified: (id: string) => void;
        createBloodBank: (bank: BloodBank) => void;
        updateBloodBank: (bank: BloodBank) => void;
        deleteBloodBank: (id: string) => void;
    };
};

const StoreContext = createContext<Store | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        applyTheme(state.theme);
        localStorage.setItem("sevasethu:theme", state.theme);
    }, [state.theme]);

    const actions = useMemo<Store["actions"]>(
        () => ({
            toggleTheme: () => dispatch({ type: "theme/toggle" }),
            flagUser: (id, value) =>
                dispatch({ type: "users/flag", id, value }),
            setRequestStatus: (id, status) =>
                dispatch({ type: "requests/setStatus", id, status }),
            setDonationStatus: (id, status) =>
                dispatch({ type: "donations/setStatus", id, status }),
            adjustDonationTokens: (id, tokens) =>
                dispatch({ type: "donations/adjustTokens", id, tokens }),
            markAlertNotified: (id) =>
                dispatch({ type: "alerts/markNotified", id }),
            createBloodBank: (bank) =>
                dispatch({ type: "bloodBanks/create", bank }),
            updateBloodBank: (bank) =>
                dispatch({ type: "bloodBanks/update", bank }),
            deleteBloodBank: (id) =>
                dispatch({ type: "bloodBanks/delete", id }),
        }),
        [],
    );

    const value = useMemo<Store>(
        () => ({ state, dispatch, actions }),
        [state, actions],
    );

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
}

export function useAppStore() {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error("useAppStore must be used inside AppProvider");
    return ctx;
}
