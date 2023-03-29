function nestComments(comments) {
    const commentMap = new Map(comments.map(comment => [comment.id, comment]));
    
    const nestedComments = [];
    
    comments.forEach(comment => {
      if (comment.parent_comment_id) {
        const parentComment = commentMap.get(comment.parent_comment_id);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(comment);
        }
      } else {
        nestedComments.push(comment);
      }
        
    });
    
    return nestedComments;
  }