let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];

let selectedRating = 0;
let editIndex = null;

/* STAR RATING */
document.querySelectorAll('.rating span').forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedRating = index + 1;

        document.querySelectorAll('.rating span').forEach(s => s.classList.remove('active'));

        for (let i = 0; i < selectedRating; i++) {
            document.querySelectorAll('.rating span')[i].classList.add('active');
        }
    });
});

/* DISPLAY */
function displayFeedbackList() {
    const container = document.getElementById('userProfileContainer');
    container.innerHTML = '';

    feedbackList.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'user-profile';

        div.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/60'}">
            <h3>${item.name}</h3>
            <p>${"⭐".repeat(item.rating || 0)}</p>

            <button type="button" class="viewBtn" data-index="${index}">View</button>
            <button type="button" class="editBtn" data-index="${index}">Edit</button>
            <button type="button" class="deleteBtn" data-index="${index}">Delete</button>
        `;

        container.appendChild(div);
    });
}

/* FORM */
const form = document.getElementById('feedbackForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedbackText = document.getElementById('feedbackText').value;
    const imageInput = document.getElementById('image');

    const reader = new FileReader();

    reader.onload = function () {
        const data = {
            name,
            email,
            feedback: feedbackText,
            rating: selectedRating,
            image: reader.result
        };

        if (editIndex !== null) {
            feedbackList[editIndex] = data;
            editIndex = null;
        } else {
            feedbackList.push(data);
        }

        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

        form.reset();
        selectedRating = 0;
        displayFeedbackList();
    };

    if (imageInput.files[0]) {
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        reader.onload();
    }
});

/* ACTIONS */
document.getElementById('userProfileContainer').addEventListener('click', function(e) {
    const index = e.target.getAttribute('data-index');
    if (index === null) return;

    const data = feedbackList[index];

    if (e.target.classList.contains('viewBtn')) {
        document.getElementById('modalName').textContent = data.name;
        document.getElementById('modalEmail').textContent = data.email;
        document.getElementById('modalFeedback').textContent = data.feedback;

        document.getElementById('feedbackModal').style.display = 'flex';
    }

    if (e.target.classList.contains('editBtn')) {
        document.getElementById('name').value = data.name;
        document.getElementById('email').value = data.email;
        document.getElementById('feedbackText').value = data.feedback;

        selectedRating = data.rating;
        editIndex = index;
    }

    if (e.target.classList.contains('deleteBtn')) {
        feedbackList.splice(index, 1);
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));
        displayFeedbackList();
    }
});

/* CLOSE MODAL */
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('feedbackModal').style.display = 'none';
});

displayFeedbackList();