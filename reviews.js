document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButton = document.querySelector('.sort-btn');
    const reviews = document.querySelectorAll('.review-card');
    let isAscending = true;

    // Filter reviews
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const rating = button.getAttribute('data-rating');

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            reviews.forEach(review => {
                const reviewRating = review.getAttribute('data-rating');
                const reviewText = review.querySelector('p').textContent.trim();

                // Show only reviews with comments and matching rating
                if ((rating === 'all' && reviewText) || (reviewRating === rating && reviewText)) {
                    review.style.display = 'block';
                } else {
                    review.style.display = 'none';
                }
            });
        });
    });

    // Sort reviews
    sortButton.addEventListener('click', () => {
        isAscending = !isAscending;
        sortButton.textContent = isAscending ? 'Sortuj: Od najgorszych' : 'Sortuj: Od najlepszych';

        const reviewsContainer = document.querySelector('.reviews');
        const sortedReviews = Array.from(reviews).sort((a, b) => {
            const ratingA = parseInt(a.getAttribute('data-rating'));
            const ratingB = parseInt(b.getAttribute('data-rating'));
            return isAscending ? ratingA - ratingB : ratingB - ratingA;
        });

        // Clear and append sorted reviews
        reviewsContainer.innerHTML = '';
        sortedReviews.forEach(review => reviewsContainer.appendChild(review));

        // Reapply filter after sorting
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-rating');
        reviews.forEach(review => {
            const reviewRating = review.getAttribute('data-rating');
            const reviewText = review.querySelector('p').textContent.trim();
            if ((activeFilter === 'all' && reviewText) || (reviewRating === activeFilter && reviewText)) {
                review.style.display = 'block';
            } else {
                review.style.display = 'none';
            }
        });
    });
});