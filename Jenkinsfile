pipeline {
    agent  any
    environment {
        SONAR_HOME= tool "SonarScanner"
        SONARQUBE_ENV = "SonarQube"
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        NGINX_ROOT = '/var/www/html'
        AWS_REGION = 'ap-south-1'
        // Node.js will be available in standard PATH
        PATH = "/usr/bin:${env.PATH}"
    }

    stages {
    
        stage('Checkout Code') {
            steps {
                echo "🔄 Cloning the Repository..."
                git branch: 'S3EC2', url: 'https://github.com/SyeedBilal/Kashmiri-Handicrafts.git'
            }
        }

        stage('Install Dependencies & Build') {
            parallel {
                stage('Backend Setup') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            echo "📦 Installing Backend Dependencies..."
                            sh 'npm ci'
                        }
                    }
                }

                stage('Frontend Setup') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            echo "📦 Installing Frontend Dependencies..."
                            sh 'npm ci'
                            echo "🔨 Building Frontend Application..."
                            // Ensure frontend is built with backend URL pointing to nginx on localhost
                            sh 'VITE_BACKEND_URL=http://localhost npm run build'
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

        stage('SonarQube Scan') {
      steps {
        dir("${BACKEND_DIR}") {
          withSonarQubeEnv('SonarQube') { // Use the name of your SonarQube server configured in Jenkins
            echo "🔍 Running SonarQube Scan..."
            
            sh """
              $SONAR_HOME/bin/sonar-scanner \
                -Dsonar.projectKey=mern-backend \
                -Dsonar.sources=. \
                -Dsonar.exclusions=node_modules/** \
                -Dsonar.host.url=\${SONAR_HOST_URL} \
                -Dsonar.login=\${SONAR_AUTH_TOKEN}
            """
           
          }
        }
      }
    }

    stage('Wait for Quality Gate') {
      steps {
        timeout(time: 8, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }



    stage('OWASP Dependency Check') {
          when {
            expression { env.NVD_API_KEY?.trim() }
          }
          steps {
            echo "Running OWASP Dependency Check..."
            dir("${BACKEND_DIR}") {
              dependencyCheck additionalArguments: '''
                --scan .
                --exclude node_modules
                --format JSON
                --out dependency-check-report
                --failOnCVSS 8
                --nvd-api-key ${NVD_API_KEY}
              ''', odcInstallation: 'OWASP-DC'
            }
            dependencyCheckPublisher pattern: '**/dependency-check-report.json'
          }
        }

        stage('Deploy Frontend with Nginx') {
            steps {
                echo "📡 Deploying frontend to NGINX root and configuring nginx..."
                // Copy build artifacts and configure nginx to serve SPA and reverse-proxy /api
                sh '''
                    set -e

                    if sudo -n true >/dev/null 2>&1; then
                      SUDO="sudo"
                    elif [ "$(id -u)" -eq 0 ]; then
                      SUDO=""
                    else
                      echo "ERROR: Jenkins user does not have passwordless sudo and is not root. Grant sudo or run this pipeline with sufficient privileges."
                      exit 1
                    fi

                    # Create nginx root and copy built files
                    ${SUDO} mkdir -p ${NGINX_ROOT}
                    ${SUDO} rm -rf ${NGINX_ROOT}/* || true
                    ${SUDO} cp -r ${FRONTEND_DIR}/dist/. ${NGINX_ROOT}/
                    ${SUDO} chown -R www-data:www-data ${NGINX_ROOT} || true

                    # Install nginx config from repo
                    ${SUDO} mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
                    ${SUDO} cp infra/nginx/frontend.conf /etc/nginx/sites-available/frontend.conf
                    ${SUDO} ln -sf /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/frontend.conf
                    ${SUDO} rm -f /etc/nginx/sites-enabled/default || true

                    # Test and reload nginx
                    ${SUDO} nginx -t
                    ${SUDO} systemctl restart nginx || ${SUDO} service nginx restart || true
                '''
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
                                                set -e
                                                # Check Frontend (served by nginx)
                                                if ! curl -fsS http://localhost/ >/dev/null; then
                                                    echo "❌ Frontend not reachable at http://localhost/" && exit 1
                                                fi

                                                # Check Backend via nginx health proxy
                                                if ! curl -fsS http://localhost/health >/dev/null; then
                                                    echo "❌ Backend health endpoint not reachable through nginx" && exit 1
                                                fi

                                                # PM2 process check
                                                pm2 status backend | grep online || (echo "❌ Backend not running (pm2)" && exit 1)

                                                echo "✅ Frontend and Backend are healthy"
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
