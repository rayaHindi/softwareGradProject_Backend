const CategorySuggestionModel = require('../model/categorySuggestion.model');
const UserModel = require('../model/user.model'); // Assuming you have a User model
const StoreModel = require('../model/store.model'); // Assuming you have a Store model

class CategorySuggestionServices {
    static async submitCategorySuggestion(suggestedById, suggestedByType, categoryName, description) {
        try {
            if (!['User', 'Store'].includes(suggestedByType)) {
                throw new Error('Invalid suggestedByType. Must be "User" or "Store".');
            }

            const suggestion = new CategorySuggestionModel({
                categoryName,
                description,
                suggestedById,
                suggestedByType,
            });

            await suggestion.save();
        } catch (error) {
            console.error('Error submitting category suggestion:', error.message);

            console.error('Error saving category suggestion:', error.message);
            throw new Error('Failed to save category suggestion.');
        }
    }

    static async getSuggestions() {
        try {
            const suggestions = await CategorySuggestionModel.find().lean();

            const populatedSuggestions = await Promise.all(
                suggestions.map(async (suggestion) => {
                    if (suggestion.suggestedByType === 'User') {
                        suggestion.suggestedBy = await UserModel.findById(suggestion.suggestedById)
                            .select('name email'); // Fetch user details
                    } else if (suggestion.suggestedByType === 'Store') {
                        suggestion.suggestedBy = await StoreModel.findById(suggestion.suggestedById)
                            .select('storeName contactEmail'); // Fetch store details
                    }
                    return suggestion;
                })
            );

            return populatedSuggestions;
        } catch (error) {
            console.error('Error fetching category suggestions:', error.message);
            throw new Error('Failed to fetch category suggestions.');
        }
    }
        static async updateSuggestionStatus(suggestionId, status) {
            try {
                const updatedSuggestion = await CategorySuggestionModel.findByIdAndUpdate(
                    suggestionId,
                    { status, reviewedAt: status !== 'pending' ? new Date() : null },
                    { new: true } // Return the updated document
                );
    
                return updatedSuggestion;
            } catch (error) {
                throw new Error('Error updating suggestion status: ' + error.message);
            }
        }
    
    
}

module.exports = CategorySuggestionServices;
