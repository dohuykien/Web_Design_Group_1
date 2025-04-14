// Đợi cho tất cả nội dung được tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Thiết lập hiệu ứng cuộn mượt cho các liên kết nội bộ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hiển thị/ẩn nút về đầu trang khi cuộn
    const createBackToTopButton = () => {
        // Tạo nút "Về đầu trang"
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.style.position = 'fixed';
        backToTopBtn.style.bottom = '20px';
        backToTopBtn.style.right = '20px';
        backToTopBtn.style.display = 'none';
        backToTopBtn.style.width = '40px';
        backToTopBtn.style.height = '40px';
        backToTopBtn.style.borderRadius = '50%';
        backToTopBtn.style.backgroundColor = '#ebac2b';
        backToTopBtn.style.color = '#fff';
        backToTopBtn.style.border = 'none';
        backToTopBtn.style.cursor = 'pointer';
        backToTopBtn.style.zIndex = '999';
        backToTopBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        document.body.appendChild(backToTopBtn);
        
        // Hiển thị/ẩn nút khi cuộn
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // Cuộn lên đầu trang khi nhấp vào nút
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    createBackToTopButton();

    // Tăng cường khả năng tương tác của các hình ảnh hướng dẫn
    const enhanceTutorialImages = () => {
        const tutorialImages = document.querySelectorAll('.tutorial-image img');
        
        tutorialImages.forEach(img => {
            // Thêm hiệu ứng hover
            img.style.transition = 'transform 0.3s ease';
            
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
            
            // Thêm khả năng phóng to hình ảnh khi click
            img.addEventListener('click', function() {
                const overlay = document.createElement('div');
                overlay.className = 'image-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
                overlay.style.display = 'flex';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';
                overlay.style.zIndex = '1000';
                
                const enlargedImg = document.createElement('img');
                enlargedImg.src = this.src;
                enlargedImg.style.maxWidth = '90%';
                enlargedImg.style.maxHeight = '90%';
                enlargedImg.style.objectFit = 'contain';
                
                overlay.appendChild(enlargedImg);
                document.body.appendChild(overlay);
                
                // Đóng overlay khi click
                overlay.addEventListener('click', function() {
                    document.body.removeChild(overlay);
                });
            });
        });
    };
    
    enhanceTutorialImages();
});