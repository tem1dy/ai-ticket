// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    let lastResults = null;

    // DOM Elements
    const els = {
        runBtn: document.getElementById('runBtn'),
        exportBtn: document.getElementById('exportBtn'),
        loader: document.getElementById('loader'),
        stats: document.getElementById('stats'),
        resultsSection: document.getElementById('results-section'),
        bodyTickets: document.getElementById('body-tickets'),
        bodyEmployees: document.getElementById('body-employees'),
        bodyResults: document.getElementById('body-results'),
        ticketCount: document.getElementById('ticket-count'),
        empCount: document.getElementById('emp-count'),
        resultCount: document.getElementById('result-count'),
        statTotal: document.getElementById('stat-total'),
        statCorrect: document.getElementById('stat-correct'),
        statIncorrect: document.getElementById('stat-incorrect'),
        statAccuracy: document.getElementById('stat-accuracy')
    };

    // Utility functions
    const getUrgencyClass = (urgency) => {
        const map = {
            'High': 'bg-red-100 text-red-700',
            'Medium': 'bg-amber-100 text-amber-700',
            'Low': 'bg-emerald-100 text-emerald-700'
        };
        return map[urgency] || 'bg-slate-100 text-slate-600';
    };

    const getLevelClass = (level) => {
        const map = {
            'Senior': 'bg-indigo-100 text-indigo-700',
            'Middle': 'bg-blue-100 text-blue-700',
            'Junior': 'bg-slate-100 text-slate-600'
        };
        return map[level] || 'bg-slate-100 text-slate-600';
    };

    const setText = (element, value) => {
        if (element) element.textContent = value;
    };

    const show = (element) => {
        if (element) element.classList.remove('hidden');
    };

    const hide = (element) => {
        if (element) element.classList.add('hidden');
    };

    // Render tickets table
    function renderTickets(tickets) {
        setText(els.ticketCount, `(${tickets?.length || 0})`);
        
        if (!tickets || tickets.length === 0) {
            els.bodyTickets.innerHTML = '<tr><td colspan="4" class="px-2 sm:px-4 py-8 text-center text-slate-400 text-xs sm:text-sm">Нет данных</td></tr>';
            return;
        }

        // Показываем первые 100 тикетов для производительности
        const displayTickets = tickets.slice(0, 100);
        
        els.bodyTickets.innerHTML = displayTickets.map(ticket => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-2 sm:px-4 py-2 sm:py-3 font-mono text-xs text-slate-500 whitespace-nowrap">${ticket.ID}</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 max-w-[150px] sm:max-w-[180px] truncate" title="${escapeHtml(ticket.Текст)}">${escapeHtml(ticket.Текст)}</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span class="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">${escapeHtml(ticket.Категория)}</span>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span class="${getUrgencyClass(ticket.Срочность)} px-2 py-0.5 rounded text-xs font-medium">${ticket.Срочность}</span>
                </td>
            </tr>
        `).join('');
    }

    // Render employees table
    function renderEmployees(employees) {
        setText(els.empCount, `(${employees?.length || 0})`);
        
        if (!employees || employees.length === 0) {
            els.bodyEmployees.innerHTML = '<tr><td colspan="4" class="px-2 sm:px-4 py-8 text-center text-slate-400 text-xs sm:text-sm">Нет данных</td></tr>';
            return;
        }

        els.bodyEmployees.innerHTML = employees.map(emp => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap">${escapeHtml(emp.Имя)}</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span class="${getLevelClass(emp.Уровень)} px-2 py-0.5 rounded text-xs font-medium">${escapeHtml(emp.Уровень)}</span>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 text-xs text-slate-600 max-w-[120px] sm:max-w-[150px] truncate" title="${escapeHtml(emp.Навыки)}">${escapeHtml(emp.Навыки)}</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 text-xs whitespace-nowrap">${emp.Текущая_нагрузка}/${emp.Макс_нагрузка}</td>
            </tr>
        `).join('');
    }

    // Render results table
    function renderResults(assignments) {
        setText(els.resultCount, `(${assignments?.length || 0})`);
        
        if (!assignments || assignments.length === 0) {
            els.bodyResults.innerHTML = '<tr><td colspan="9" class="px-2 sm:px-4 py-8 text-center text-slate-400 text-xs sm:text-sm">Нет данных</td></tr>';
            return;
        }

        els.bodyResults.innerHTML = assignments.map(r => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-2 sm:px-4 py-2 sm:py-3 font-mono text-xs text-slate-500 whitespace-nowrap">${r.ticket_id}</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 max-w-[150px] sm:max-w-[200px] truncate" title="${escapeHtml(r.text)}">${escapeHtml(r.text)}</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span class="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">${escapeHtml(r.original_category)}</span>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">${escapeHtml(r.ai_category)}</span>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 text-xs whitespace-nowrap">${(r.confidence * 100).toFixed(0)}%</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span class="${getUrgencyClass(r.urgency)} px-2 py-0.5 rounded text-xs font-medium">${r.urgency}</span>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap">${escapeHtml(r.assigned_to)}</td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span class="${getLevelClass(r.employee_level)} px-2 py-0.5 rounded text-xs font-medium">${escapeHtml(r.employee_level)}</span>
                </td>
                <td class="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${r.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}">${r.status}</span>
                </td>
            </tr>
        `).join('');
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Load initial data
    async function loadInitData() {
        try {
            const response = await fetch('/api/init');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            renderTickets(data.tickets);
            renderEmployees(data.employees);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            alert('Не удалось загрузить таблицы. Проверьте консоль браузера (F12).');
        }
    }

    // Run AI processing
    async function runProcessing() {
        // UI updates
        hide(els.stats);
        hide(els.resultsSection);
        hide(els.exportBtn);
        show(els.loader);
        
        if (els.runBtn) {
            els.runBtn.disabled = true;
            els.runBtn.textContent = 'Обработка...';
        }

        try {
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();

            // Update statistics
            setText(els.statTotal, data.total);
            setText(els.statCorrect, data.correct);
            setText(els.statIncorrect, data.incorrect);
            setText(els.statAccuracy, `${(data.accuracy * 100).toFixed(1)}%`);

            // Store and render results
            lastResults = data.assignments;
            renderResults(data.assignments);

            // Show results
            show(els.stats);
            show(els.resultsSection);
            show(els.exportBtn);

        } catch (error) {
            console.error('Ошибка обработки:', error);
            alert(`Ошибка при обработке: ${error.message}`);
        } finally {
            hide(els.loader);
            if (els.runBtn) {
                els.runBtn.disabled = false;
                els.runBtn.textContent = 'Запустить';
            }
        }
    }

    // Export to CSV
    function exportToCSV() {
        if (!lastResults || lastResults.length === 0) {
            alert('Нет данных для экспорта');
            return;
        }

        const headers = ['ID;Текст;Категория_ориг;Категория_AI;Уверенность_%;Приоритет;Сложность;Ответственный;Уровень;Статус'];
        
        const rows = lastResults.map(r => {
            // Escape quotes and wrap text in quotes for CSV
            const text = `"${(r.text || '').replace(/"/g, '""')}"`;
            const status = r.is_correct ? 'Корректно' : 'Ошибка';
            
            return [
                r.ticket_id,
                text,
                r.original_category,
                r.ai_category,
                (r.confidence * 100).toFixed(1),
                r.urgency,
                r.difficulty,
                r.assigned_to,
                r.employee_level,
                status
            ].join(';');
        });

        // Add BOM for Excel UTF-8 support
        const csvContent = '\uFEFF' + [headers.join('\n'), ...rows].join('\n');
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `routing_report_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Event listeners
    if (els.runBtn) {
        els.runBtn.addEventListener('click', runProcessing);
    }

    if (els.exportBtn) {
        els.exportBtn.addEventListener('click', exportToCSV);
    }

    // Initialize
    loadInitData();
});