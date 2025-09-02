# Content Scraping System - README

## Overview

The Content Scraping System for PrepWithAI HP is a comprehensive web scraping and content management solution designed specifically for HP government exam preparation. This system automatically collects, processes, and categorizes content from various official and educational sources.

## Features

### 🎯 Intelligent Content Discovery
- **Multi-format Support**: PDF, HTML, images, videos, documents, JSON, XML
- **AI-Powered Categorization**: Automatically categorizes content by exam type, subject, and importance
- **Quality Assessment**: Advanced quality scoring and content filtering
- **Duplicate Detection**: SHA-256 based content deduplication

### 🌐 Smart Web Scraping
- **Ethical Scraping**: Respects robots.txt and implements proper rate limiting
- **Browser Automation**: JavaScript-heavy sites support with Playwright
- **Multiple Protocols**: HTTP/HTTPS, REST APIs, RSS feeds
- **Dynamic Content**: Handles SPAs and dynamically loaded content

### 🔧 Flexible Configuration
- **Source Management**: Easy addition and management of content sources
- **Custom Extraction Rules**: CSS selectors and XPath support
- **Scheduling**: Automated scraping with configurable frequencies
- **Content Filtering**: Keyword-based inclusion/exclusion rules

### 📊 Advanced Analytics
- **Performance Monitoring**: Success rates, response times, error tracking
- **Content Analytics**: Trending topics, source effectiveness
- **User Engagement**: Download counts, popularity metrics
- **System Health**: Real-time monitoring and alerts

## Architecture

### Backend Components

#### 1. Database Models (`/app/db/models/scraped_content.py`)
- **ScrapedContent**: Main content repository with 40+ fields
- **ScrapingJob**: Task management and execution tracking
- **ScrapingConfig**: Reusable scraping configurations
- **ContentSource**: Managed source definitions
- **ContentAnalytics**: Performance and usage metrics

#### 2. Content Scraper Service (`/app/services/content_scraper.py`)
- **Multi-format Processing**: Specialized handlers for different content types
- **AI Integration**: Content enhancement and categorization
- **Quality Control**: Automated content validation
- **Error Handling**: Robust error recovery and logging

#### 3. Admin API (`/app/api/v1/admin/content_scraping.py`)
- **Complete CRUD Operations**: 20+ endpoints for full system management
- **Dashboard Analytics**: Real-time metrics and insights
- **Bulk Operations**: Efficient batch processing
- **Search and Filtering**: Advanced content discovery

### Frontend Components

#### 1. Main Dashboard (`/app/admin/content-scraping/page.tsx`)
- **Overview Analytics**: System-wide metrics and KPIs
- **Job Management**: Create, monitor, and control scraping jobs
- **Content Browser**: Search and manage scraped content
- **Real-time Updates**: Live job progress and status

#### 2. Source Management (`/components/content-scraping/SourcesTab.tsx`)
- **Source Configuration**: Easy setup of new content sources
- **Health Monitoring**: Source availability and performance tracking
- **Scheduling**: Automated scraping frequency management
- **Testing Tools**: Connection and compatibility testing

#### 3. Configuration Management (`/components/content-scraping/ConfigsTab.tsx`)
- **Scraping Rules**: Define extraction patterns and filters
- **AI Settings**: Configure content enhancement features
- **Quality Control**: Set thresholds and validation rules
- **Advanced Options**: Custom selectors and processing logic

## Supported Sources

### Government Websites
- **HPPSC**: Himachal Pradesh Public Service Commission
- **HPSSC**: Himachal Pradesh Staff Selection Commission
- **HPTET**: Himachal Pradesh Teacher Eligibility Test
- **District Administrations**: All 12 HP districts
- **Himachal Portal**: Official state government portal

### Educational Platforms
- **National Portals**: NCERT, NIOS, UGC resources
- **Competitive Exam Sites**: TestBook, Unacademy, BYJU'S
- **Academic Institutions**: HP University, NIT Hamirpur
- **Online Libraries**: Digital repositories and databases

### News and Updates
- **Local News**: HP-specific current affairs
- **Government Notifications**: Policy updates and announcements
- **Examination News**: Test schedules and updates
- **Employment News**: Job notifications and opportunities

## Content Categories

### Primary Categories
- **Notifications**: Official announcements and circulars
- **Study Materials**: Textbooks, guides, and reference materials
- **Question Papers**: Previous years and practice tests
- **Current Affairs**: Recent developments and news
- **Syllabus**: Examination curricula and patterns
- **Results**: Score cards and merit lists

### Secondary Classifications
- **Exam Type**: HPAS, HPSSC, HPTET, Banking, SSC
- **Subject**: General Studies, Mathematics, English, Hindi
- **Difficulty**: Beginner, Intermediate, Advanced
- **Format**: Multiple Choice, Descriptive, Practical

## API Endpoints

### Job Management
```
POST   /api/v1/admin/content-scraping/jobs          # Create new job
GET    /api/v1/admin/content-scraping/jobs          # List all jobs
GET    /api/v1/admin/content-scraping/jobs/{id}     # Get job details
PUT    /api/v1/admin/content-scraping/jobs/{id}     # Update job
DELETE /api/v1/admin/content-scraping/jobs/{id}     # Delete job
POST   /api/v1/admin/content-scraping/jobs/{id}/start  # Start job
POST   /api/v1/admin/content-scraping/jobs/{id}/stop   # Stop job
```

### Content Management
```
GET    /api/v1/admin/content-scraping/content       # Search content
GET    /api/v1/admin/content-scraping/content/{id}  # Get content details
PUT    /api/v1/admin/content-scraping/content/{id}  # Update content
DELETE /api/v1/admin/content-scraping/content/{id}  # Delete content
POST   /api/v1/admin/content-scraping/content/bulk  # Bulk operations
```

### Analytics
```
GET    /api/v1/admin/content-scraping/dashboard     # Dashboard metrics
GET    /api/v1/admin/content-scraping/analytics     # Detailed analytics
GET    /api/v1/admin/content-scraping/performance   # Performance metrics
GET    /api/v1/admin/content-scraping/sources/health # Source health check
```

## Installation and Setup

### Backend Requirements
```bash
# Install Python dependencies
pip install aiohttp beautifulsoup4 pymupdf playwright spacy transformers

# Install browser for Playwright
playwright install chromium

# Download spaCy model
python -m spacy download en_core_web_sm
```

### Database Migration
```bash
# Run the migration to create tables
alembic upgrade head
```

### Environment Variables
```env
# AI Services (Optional)
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_hf_key

# Scraping Configuration
MAX_CONCURRENT_JOBS=5
DEFAULT_RATE_LIMIT=1.0
USER_AGENT="PrepWithAI-HP-Bot/1.0"
```

## Usage Examples

### Creating a Scraping Job
```typescript
const job = await api.createJob({
  job_name: "Daily HP Government Updates",
  job_type: "scheduled",
  target_urls: [
    "https://hppsc.hp.gov.in",
    "https://hpssc.hp.gov.in"
  ],
  scraping_config_id: 1,
  priority: 5
})
```

### Configuring a Source
```typescript
const source = await api.createSource({
  name: "HPPSC Official",
  source_url: "https://hppsc.hp.gov.in",
  source_type: "government",
  scraping_frequency: "daily",
  content_categories: ["notification", "syllabus"],
  exam_focus: ["HPAS", "HCS"]
})
```

### Setting Up Scraping Configuration
```typescript
const config = await api.createConfig({
  name: "HP Government Sites",
  source_type: "government",
  domain_patterns: ["*.hp.gov.in"],
  crawl_depth: 2,
  rate_limit_delay: 2.0,
  extract_text: true,
  extract_images: true,
  auto_categorize: true,
  generate_summary: true,
  quality_threshold: 0.8
})
```

## Best Practices

### Ethical Scraping
1. **Respect robots.txt**: Always check and follow robots.txt directives
2. **Rate Limiting**: Implement appropriate delays between requests
3. **User Agent**: Use descriptive and identifiable user agent strings
4. **Contact Information**: Provide contact details in case of issues

### Performance Optimization
1. **Concurrent Limits**: Limit simultaneous requests per domain
2. **Caching**: Implement intelligent caching strategies
3. **Error Handling**: Robust retry mechanisms with exponential backoff
4. **Resource Management**: Proper cleanup of browser instances

### Content Quality
1. **Validation**: Implement content validation rules
2. **Deduplication**: Use content hashing to avoid duplicates
3. **Categorization**: Ensure proper content classification
4. **Review Process**: Manual verification for high-importance content

## Monitoring and Maintenance

### Health Checks
- **Source Availability**: Regular connectivity tests
- **Content Freshness**: Monitor for new content availability
- **Error Rates**: Track and alert on high failure rates
- **Performance Metrics**: Response times and success rates

### Maintenance Tasks
- **Database Cleanup**: Remove old or obsolete content
- **Index Optimization**: Keep search indexes current
- **Log Rotation**: Manage log file sizes
- **Configuration Updates**: Adapt to source changes

## Security Considerations

### Data Protection
- **Content Encryption**: Encrypt sensitive scraped content
- **Access Control**: Role-based access to admin features
- **Audit Logging**: Track all system activities
- **Data Retention**: Implement appropriate retention policies

### System Security
- **Input Validation**: Sanitize all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Escape output content
- **Rate Limiting**: Prevent abuse of API endpoints

## Future Enhancements

### Planned Features
1. **Machine Learning**: Enhanced content classification
2. **Natural Language Processing**: Automatic summarization
3. **Image Recognition**: Extract text from images
4. **Real-time Notifications**: Instant alerts for new content
5. **Mobile App Integration**: Sync with mobile applications

### Scalability Improvements
1. **Distributed Processing**: Multi-server job execution
2. **Cloud Storage**: Object storage for large files
3. **CDN Integration**: Fast content delivery
4. **Auto-scaling**: Dynamic resource allocation

## Troubleshooting

### Common Issues

#### Job Failures
- Check source availability
- Verify network connectivity
- Review error logs for specific failures
- Validate scraping configuration

#### Slow Performance
- Increase rate limit delays
- Reduce crawl depth
- Optimize database queries
- Check server resources

#### Content Quality Issues
- Adjust quality thresholds
- Review extraction rules
- Update AI model parameters
- Implement manual review process

### Support and Documentation
- **Error Codes**: Comprehensive error code reference
- **API Documentation**: Complete endpoint documentation
- **User Guides**: Step-by-step setup instructions
- **Video Tutorials**: Visual learning resources

## Contributing

### Development Guidelines
1. **Code Standards**: Follow PEP 8 for Python, ESLint for TypeScript
2. **Testing**: Write comprehensive unit and integration tests
3. **Documentation**: Update documentation for all changes
4. **Security**: Security review for all contributions

### Bug Reports and Feature Requests
- Use GitHub issues for bug reports
- Provide detailed reproduction steps
- Include relevant logs and screenshots
- Tag issues appropriately

## License and Legal

### Terms of Use
- Content scraping must comply with source website terms
- Respect copyright and intellectual property rights
- Use scraped content for educational purposes only
- Attribute sources appropriately

### Disclaimer
This system is designed for educational content aggregation. Users are responsible for ensuring compliance with all applicable laws and regulations regarding web scraping and content usage.

---

*PrepWithAI HP Content Scraping System - Empowering HP Government Exam Preparation Through Intelligent Content Discovery*
