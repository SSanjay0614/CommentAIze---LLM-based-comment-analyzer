document.addEventListener('DOMContentLoaded', () => {
    const dragArea = document.getElementById('dragArea');
    const fileInput = document.getElementById('fileInput');
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('resultsSection');
    const errorMessage = document.getElementById('errorMessage');
    let sentimentChart = null;

    // Drag and drop handlers
    ['dragenter', 'dragover'].forEach(eventName => {
        dragArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            dragArea.classList.add('active');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            dragArea.classList.remove('active');
        });
    });

    dragArea.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (!file) return;

        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            showError('Please upload a PDF or Word document');
            return;
        }

        uploadFile(file);
    }

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        // Show loading state
        loading.classList.add('active');
        resultsSection.classList.remove('active');
        errorMessage.classList.remove('active');

        fetch('/api/analyze', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            try {
                const result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
                displayResults(result);
            } catch (e) {
                throw new Error('Invalid response format from server');
            }
        })
        .catch(error => {
            showError(error.message);
        })
        .finally(() => {
            loading.classList.remove('active');
        });
    }

    function displayResults(data) {
        // Display sentiment chart
        const sentimentData = parseSentimentSummary(data.sentiment_summary);
        displaySentimentChart(sentimentData);

        // Display feedback summary
        const feedbackSummaryElement = document.getElementById('feedbackSummary');
        feedbackSummaryElement.innerHTML = `
            <div class="feedback-item">
                <h4>👍 Likes</h4>
                <p>${data.feedback_summary.likes}</p>
            </div>
            <div class="feedback-item">
                <h4>👎 Dislikes</h4>
                <p>${data.feedback_summary.dislikes}</p>
            </div>
            <div class="feedback-item">
                <h4>💡 Suggestions</h4>
                <p>${data.feedback_summary.suggestions}</p>
            </div>
        `;

        // Display categorized comments
        const categoriesElement = document.getElementById('commentCategories');
        categoriesElement.innerHTML = Object.entries(data.categorized_comments)
            .map(([category, comments]) => `
                <div class="feedback-item">
                    <h4>${capitalizeFirstLetter(category)} (${comments.length})</h4>
                    <ul>
                        ${comments.map(comment => `<li>${comment}</li>`).join('')}
                    </ul>
                </div>
            `).join('');

        // Display toxic comments
        const toxicElement = document.getElementById('toxicComments');
        if (data.toxic_comments.length > 0) {
            toxicElement.innerHTML = `
                <div class="feedback-item">
                    <ul>
                        ${data.toxic_comments.map(comment => `<li>${comment}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            toxicElement.innerHTML = '<p>No toxic comments found.</p>';
        }

        resultsSection.classList.add('active');
    }

    function parseSentimentSummary(summary) {
        try {
            const percentages = summary.match(/(\d+)%/g);
            if (!percentages) {
                return { positive: 0, neutral: 0, negative: 0 };
            }
            return {
                positive: parseInt(percentages[0]) || 0,
                neutral: parseInt(percentages[1]) || 0,
                negative: parseInt(percentages[2]) || 0
            };
        } catch (e) {
            console.error('Error parsing sentiment summary:', e);
            return { positive: 0, neutral: 0, negative: 0 };
        }
    }

    function displaySentimentChart(sentimentData) {
        if (sentimentChart) {
            sentimentChart.destroy();
        }

        const ctx = document.getElementById('sentimentChart').getContext('2d');
        sentimentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                    data: [
                        sentimentData.positive,
                        sentimentData.neutral,
                        sentimentData.negative
                    ],
                    backgroundColor: [
                        '#22c55e',
                        '#64748b',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('active');
        loading.classList.remove('active');
        resultsSection.classList.remove('active');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});