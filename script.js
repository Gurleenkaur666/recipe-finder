// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const searchBtn = document.getElementById('search-btn');
    const mealList = document.getElementById('meal');
    const mealDetailsContent = document.querySelector('.meal-details-content');
    const recipeCloseBtn = document.getElementById('recipe-close-btn');
    const mealDetails = document.querySelector('.meal-details');

    // Event listeners
    searchBtn.addEventListener('click', getMealList);
    recipeCloseBtn.addEventListener('click', () => {
        mealDetails.classList.remove('showRecipe');
    });

    // Function to get meal list based on search input
    function getMealList() {
        let searchInputTxt = document.getElementById('search-input').value.trim();
        
        if (searchInputTxt !== '') {
            // Fetch meals from TheMealDB API based on ingredient
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
                .then(response => response.json())
                .then(data => {
                    let html = "";
                    if (data.meals) {
                        data.meals.forEach(meal => {
                            html += `
                                <div class="meal-item">
                                    <div class="meal-img">
                                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                    </div>
                                    <div class="meal-name">
                                        <h3>${meal.strMeal}</h3>
                                    </div>
                                    <a href="#" class="recipe-btn">Get Recipe</a>
                                </div>
                            `;
                        });
                    } else {
                        html = "Sorry, we didn't find any meal!";
                    }
                    mealList.innerHTML = html;

                    // Add event listeners to newly created "Get Recipe" buttons
                    const recipeBtns = document.querySelectorAll('.recipe-btn');
                    recipeBtns.forEach(btn => {
                        btn.addEventListener('click', getMealRecipe);
                    });
                })
                .catch(error => {
                    console.error('Error fetching meals:', error);
                    mealList.innerHTML = "An error occurred while fetching the meals.";
                });
        } else {
            mealList.innerHTML = "Please enter an ingredient to search.";
        }
    }

    // Function to get meal recipe and list of ingredients
    function getMealRecipe(event) {
        event.preventDefault();
        if (event.target.classList.contains('recipe-btn')) {
            let mealItem = event.target.parentElement;
            let mealName = mealItem.querySelector('.meal-name h3').innerText;

            // Fetch meal details based on meal name
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
                .then(response => response.json())
                .then(data => {
                    let meal = data.meals[0];
                    let html = `
                        <h2 class="recipe-title">${meal.strMeal}</h2>
                        <p class="recipe-category">${meal.strCategory}</p>
                        <div class="recipe-instruct">
                            <h3>Instructions</h3>
                            <p>${meal.strInstructions}</p>
                        </div>
                        <div class="recipe-meal-img">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        </div>
                        <div class="recipe-link">
                            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
                        </div>
                        <div class="recipe-ingredients">
                            <h3>Ingredients</h3>
                            <ul>
                                ${getIngredientsList(meal)}
                            </ul>
                        </div>
                    `;
                    mealDetailsContent.innerHTML = html;
                    mealDetails.classList.add('showRecipe');
                })
                .catch(error => {
                    console.error('Error fetching meal details:', error);
                    mealDetailsContent.innerHTML = "An error occurred while fetching the meal details.";
                    mealDetails.classList.add('showRecipe');
                });
        }
    }

    // Function to extract ingredients and measures
    function getIngredientsList(meal) {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            let ingredient = meal[`strIngredient${i}`];
            let measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== '') {
                ingredients.push(`<li>${ingredient} - ${measure}</li>`);
            }
        }
        return ingredients.join('');
    }

    // Optional: Close meal details when clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === mealDetails) {
            mealDetails.classList.remove('showRecipe');
        }
    });

    // Optional: Close meal details with the Esc key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            mealDetails.classList.remove('showRecipe');
        }
    });
});
