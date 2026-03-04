import { useEffect, useState } from "react";

export default function Toast({ type, msg }) {
    const [show, setShow] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setShow(false), 3200);
        return () => clearTimeout(t);
    }, []);
    if (!show) return null;
    return (
        <div className={`toast toast-${type}`}>
            {type === "success" ? "✅" : "❌"} {msg}
        </div>
    );
}
