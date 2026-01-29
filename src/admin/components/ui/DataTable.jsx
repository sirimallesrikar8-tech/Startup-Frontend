import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown, FileX } from 'lucide-react';
import Modal from './Modal';

const DataTable = ({ columns, data, searchable = true, onRowClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        let sortableData = [...data];

        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableData;
    }, [data, sortConfig]);

    const filteredData = sortedData.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(debouncedSearch.toLowerCase())
        )
    );

    const handleRowClick = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
        if (onRowClick) {
            onRowClick(row);
        }
    };

    return (
        <>
            <div className="card">
                {searchable && (
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '3rem' }}
                        />
                        {searchTerm && (
                            <div style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)'
                            }}>
                                {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                )}

                {filteredData.length > 0 ? (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column.key}
                                                onClick={() => column.sortable && handleSort(column.key)}
                                                style={{
                                                    cursor: column.sortable ? 'pointer' : 'default',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {column.label}
                                                    {column.sortable && sortConfig.key === column.key && (
                                                        sortConfig.direction === 'asc' ?
                                                            <ChevronUp size={16} /> :
                                                            <ChevronDown size={16} />
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleRowClick(row)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {columns.map((column) => (
                                                <td key={column.key}>
                                                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border-color)',
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem'
                        }}>
                            Showing {filteredData.length} of {data.length} entries
                        </div>
                    </>
                ) : (
                    <div style={{
                        padding: '3rem 2rem',
                        textAlign: 'center'
                    }}>
                        <FileX size={48} style={{
                            color: 'var(--text-muted)',
                            margin: '0 auto 1rem',
                            opacity: 0.5
                        }} />
                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            No data found
                        </h4>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                            {searchTerm ? `No results match "${searchTerm}"` : 'No data available to display'}
                        </p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedRow && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Details"
                    size="md"
                >
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {Object.entries(selectedRow).map(([key, value]) => (
                            <div key={key} style={{
                                padding: '0.75rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--border-radius-sm)',
                                display: 'grid',
                                gridTemplateColumns: '140px 1fr',
                                gap: '1rem',
                                alignItems: 'start'
                            }}>
                                <span style={{
                                    fontWeight: '600',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    textTransform: 'capitalize'
                                }}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    wordBreak: 'break-word'
                                }}>
                                    {Array.isArray(value) ? value.join(', ') : String(value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
};

export default DataTable;
