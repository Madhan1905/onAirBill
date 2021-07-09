import React from 'react';

const LoadingComponent = () => {
    return(
        <div className="modal loading-modal">
          <div className="modal-dialog modal-dialog-centered spinning-modal-body" role="document">
            <div>
              <span className="spinner-border"/>
            </div>
          </div>
        </div>
    )
}

export default LoadingComponent;