import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({
    label,
    value,
    onChange,
    options,
    icon,
    id,
    placeholder = "Todos",
    showPlaceholderOption = true
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue, id } });
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    return (
        <div className={`filter-card filter-card-select custom-select ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
            {icon && (
                <span className="filter-card-icon" aria-hidden="true">
                    {icon}
                </span>
            )}
            <div className="filter-card-body" onClick={() => setIsOpen(!isOpen)}>
                <label className="filter-card-label" htmlFor={id}>
                    {label}
                </label>
                <div className="filter-card-input custom-select-trigger">
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {displayValue}
                    </span>
                </div>
                <span className="filter-card-arrow" aria-hidden="true"></span>
            </div>

            {isOpen && (
                <ul className="custom-select-options">
                    {showPlaceholderOption && (
                        <li
                            className={`custom-select-option ${value === "" ? "selected" : ""}`}
                            onClick={() => handleSelect("")}
                        >
                            {placeholder}
                        </li>
                    )}
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`custom-select-option ${value === option.value ? "selected" : ""}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
