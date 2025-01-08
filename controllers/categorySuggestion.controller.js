const CategorySuggestionServices = require('../services/categorySuggestion.services');
exports.submitSuggestion = async (req, res) => {
    const { categoryName, description, userType } = req.body;
    const userId = req.user._id;

    try {
        if (!categoryName) {
            return res.status(400).json({ success: false, message: 'Category name is required.' });
        }

        if (!['User', 'Store'].includes(userType)) {
            return res.status(400).json({ success: false, message: 'Invalid user type.' });
        }

        await CategorySuggestionServices.submitCategorySuggestion(
            userId,
            userType,
            categoryName,
            description
        );

        res.status(201).json({ success: true, message: 'Category suggestion submitted successfully.' });
    } catch (error) {
        console.error('Error submitting category suggestion:', error.message);
        res.status(500).json({ success: false, message: 'Failed to submit category suggestion.' });
    }
};



exports.getSuggestions = async (req, res) => {
    try {
        const suggestions = await CategorySuggestionServices.getSuggestions();
        res.status(200).json({ success: true, suggestions });
    } catch (error) {
        console.error('Error fetching category suggestions:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch category suggestions.' });
    }
};

exports.updateSuggestionStatus = async (req, res) => {
    const { suggestionId } = req.params;
    const { status } = req.body;

    try {
        if (!['approved', 'rejected', 'pending', 'reviewed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value.' });
        }

        const updatedSuggestion = await CategorySuggestionServices.updateSuggestionStatus(suggestionId, status);

        if (!updatedSuggestion) {
            return res.status(404).json({ success: false, message: 'Suggestion not found.' });
        }

        res.status(200).json({ success: true, message: 'Suggestion status updated successfully.', suggestion: updatedSuggestion });
    } catch (error) {
        console.error('Error updating suggestion status:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update suggestion status.' });
    }
};