pipeline {
    agent { label 'ec2-agent' }

    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        NGINX_ROOT = '/var/www/html'
        S3_BUCKET = 'kash-handicrafts-s3'
        AWS_REGION = 'ap-south-1'  // change if needed
          NODEJS_HOME = '/usr/local/bin'
        PATH = "${NODEJS_HOME}:${PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Cloning the Repository..."
                git branch: 'non-docker', url: 'https://github.com/SyeedBilal/Kashmiri-Handicrafts.git'
            }
        }

        stage('Install Dependencies & Build') {
            parallel {
                stage('Backend Setup') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'which node && which npm && node -v && npm -v'

                            echo "📦 Installing Backend Dependencies..."
                            sh 'npm install --production'
                        }
                    }
                }

                stage('Frontend Setup') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            echo "📦 Installing Frontend Dependencies..."
                            sh 'npm install'
                            echo "🔨 Building Frontend Application..."
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Validate Build') {
            steps {
                script {
                    def buildExists = fileExists("${FRONTEND_DIR}/dist/index.html")
                    if (!buildExists) {
                        error("❌ Frontend build failed - dist/index.html not found")
                    }
                    echo "✅ Build artifacts validated"
                }
            }
        }

        stage('Deploy Frontend to S3') {
            steps {
                echo "🚀 Deploying frontend build to AWS S3..."
                dir("${FRONTEND_DIR}") {
                    sh "aws s3 sync dist/ s3://${S3_BUCKET} --delete --region ${AWS_REGION}"
                }
            }
        }

        stage('Deploy Backend with PM2') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "🚀 Starting Backend Application with PM2..."
                    sh '''
                        pm2 stop backend || true
                        pm2 delete backend || true
                        pm2 start app.js --name "backend"
                        pm2 save
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "🏥 Performing health checks..."
                    sleep(time: 5, unit: 'SECONDS')

                    sh '''
                        # Check Frontend
                       curl -f http://kash-handicrafts-s3.s3-website.ap-south-1.amazonaws.com || (echo "❌ Frontend check failed" && exit 1)
                        echo "✅ Frontend is healthy"

                        # Check Backend
                        pm2 status backend | grep online || (echo "❌ Backend not running" && exit 1)
                        echo "✅ Backend is healthy"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment Completed Successfully ✅"
        }
        failure {
            echo "💥 Deployment Failed ❌"
            echo "Consider rolling back to previous backup"
        }
        always {
            echo "Pipeline finished at: ${new Date()}"
        }
    }
}
