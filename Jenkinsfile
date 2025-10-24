pipeline {
    agent {
         label 'ec2-fleet' 
    }

    environment {
        NODEJS_HOME = '/usr/local/bin/node'
        PATH = "${NODEJS_HOME}:${PATH}"
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        NGINX_ROOT = '/var/www/html'
    }

    stages {
        stage('CheckOut Code') {
            steps {
                echo "🔄 Cloning the Repository...."
                git branch: 'non-docker', 
                    url: 'https://github.com/SyeedBilal/Kashmiri-Handicrafts.git'
            }
        }

        stage('Backup Current Deployment') {
            steps {
                script {
                    echo "💾 Creating backup..."
                    sh '''
                        TIMESTAMP=$(date +%Y%m%d-%H%M%S)
                        [ -d "${NGINX_ROOT}" ] && sudo tar -czf /tmp/frontend-backup-${TIMESTAMP}.tar.gz -C ${NGINX_ROOT} . || true
                        echo "✅ Backup completed"
                    '''
                }
            }
        }

        stage('Install Dependencies & Build') {
            parallel {
                stage('Backend Setup') {
                    steps {
                        dir("${BACKEND_DIR}") {
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

        stage('Deploy Frontend to Nginx') {
            steps {
                echo "🚀 Deploying frontend build to Nginx....."
                sh """
                    sudo rm -rf ${NGINX_ROOT}/*
                    sudo cp -r ${FRONTEND_DIR}/dist/* ${NGINX_ROOT}/
                    sudo systemctl restart nginx
                """
            }
        }

        stage('Deploy Backend with pm2') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "🚀 Starting Backend Application with pm2...."
                    sh '''
                        pm2 stop backend || true
                        pm2 delete backend || true
                        pm2 start app.js --name "backend" --env production
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
                        curl -f http://localhost:80 || (echo "❌ Frontend check failed" && exit 1)
                        echo "✅ Frontend is healthy"
                        
                        # Check Backend (adjust port if needed)
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
