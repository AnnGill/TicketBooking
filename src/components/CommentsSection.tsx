import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  TextField, 
  Button, 
  Rating, 
  Avatar, 
  List, 
  ListItem 
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Comment } from '../types';
import './CommentsSection.scss';

interface CommentsSectionProps {
  movieId: number;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = observer(({ 
  movieId, 
  comments, 
  onAddComment 
}) => {
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!commentText.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    if (!rating) {
      setError('Please provide a rating');
      return;
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      movieId,
      userName: userName.trim(),
      text: commentText.trim(),
      rating,
      date: new Date().toISOString()
    };
    
    onAddComment(newComment);
    
    // Reset form
    setUserName('');
    setCommentText('');
    setRating(null);
    setError('');
  };

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get random color for avatar based on username
  const getAvatarColor = (name: string) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffc107', '#ff9800', '#ff5722'
    ];
    
    const hashCode = name.split('').reduce(
      (hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0
    );
    
    return colors[Math.abs(hashCode) % colors.length];
  };

  return (
    <Paper elevation={3} className="comments-section">
      <Typography variant="h5" component="h2" gutterBottom>
        Comments & Reviews
      </Typography>
      
      <Box component="form" onSubmit={handleSubmitComment} className="comment-form">
        <TextField
          label="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Typography component="legend">Your Rating:</Typography>
          <Rating
            name="movie-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            precision={0.5}
          />
        </Box>
        
        <TextField
          label="Your Comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          multiline
          rows={4}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
        >
          Submit Comment
        </Button>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <List className="comments-list">
        {comments.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => (
            <ListItem key={comment.id} disablePadding className="comment-item">
              <Box className="comment-content">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: getAvatarColor(comment.userName),
                      width: 40,
                      height: 40,
                      mr: 2
                    }}
                  >
                    {comment.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {comment.userName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={comment.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {formatDate(comment.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ pl: 7 }}>
                  {comment.text}
                </Typography>
              </Box>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
});

export default CommentsSection;
