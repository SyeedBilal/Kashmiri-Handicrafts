pipeline {
  agent {
      label "master"
      
  }

  parameters {
    booleanParam(name: 'FORCE_DEPLOY', defaultValue: false, description: 'Ignore CRITICAL vulnerabilities and continue deploy')
  }

  environment {
     SONAR_HOME= tool "SonarScanner"
    AWS_REGION       = "ap-south-1"
    AWS_ACCOUNT_ID   = "428207183578"
    ECR_REGISTRY     = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    ECR_REPO         = "kash-handi-backend-backend"
    ECR_URL          = "${ECR_REGISTRY}/${ECR_REPO}"
    IMAGE_NAME       = "kash-handi-backend-backend"
    BACKEND_DIR      = "backend"
    ECS_CLUSTER      = "kash-handi-backend-cluster"
    ECS_SERVICE      = "kash-handi-backend-service"
    SONARQUBE_ENV    = "SonarQubeServer"
    // Use unique tag for better traceability
    IMAGE_TAG        = "build-${BUILD_NUMBER}-${GIT_COMMIT_SHORT}"
  }

  stages {
    stage('Checkout') {
      steps {
        echo "🔄 Cloning repository..."
        git branch: 'S3ECS', url: 'https://github.com/SyeedBilal/Kashmiri-Handicrafts.git'
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        dir("${BACKEND_DIR}") {
          echo "Installing the modules ....."
          sh 'npm install --production'
        }
      }
    }

 
    stage('SonarQube Scan') {
      steps {
        dir("${BACKEND_DIR}") {
          withSonarQubeEnv('SonarQubeServer') {
            
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
      steps {
        echo "Running OWASP Dependency Check..."
        dir("${BACKEND_DIR}") {
          dependencyCheck additionalArguments: '''
            --scan .
            --exclude node_modules
            --format XML
            --out dependency-check-report
            --failOnCVSS 7
          ''', odcInstallation: 'OWASP-DC'
        }
        dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
      }
    }

    stage('AWS Identity Check') {
      steps {
        echo "Checking AWS identity..."
        sh "aws sts get-caller-identity --region ${AWS_REGION}"
      }
    }

    stage('Login to ECR') {
      steps {
        echo "Logging into ECR..."
        sh """
          aws ecr get-login-password --region ${AWS_REGION} | \
            docker login --username AWS --password-stdin ${ECR_REGISTRY}
        """
      }
    }

    stage('Build & Push Image') {
      steps {
        dir("${BACKEND_DIR}") {
          script {
            // Check if Dockerfile exists
            if (!fileExists('Dockerfile')) {
              error("Dockerfile not found in ${BACKEND_DIR} directory!")
            }
            
            echo "Building Docker image..."
            sh """
              docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .
              docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${ECR_URL}:${IMAGE_TAG}
              docker tag ${IMAGE_NAME}:latest ${ECR_URL}:latest
              docker push ${ECR_URL}:${IMAGE_TAG}
              docker push ${ECR_URL}:latest
            """
          }
        }
      }
    }

    
    stage('Trivy Vulnerability Scan') {
      steps {
        echo "Running Trivy scan against ${IMAGE_NAME}:${IMAGE_TAG} ..."
        sh """
          # Update vulnerability database
          trivy image --download-db-only
          
          trivy image --severity HIGH,CRITICAL \
            --format table \
            --exit-code 0 \
            --output trivy-report.txt \
            ${IMAGE_NAME}:${IMAGE_TAG}
          
          trivy image --severity HIGH,CRITICAL \
            --format json \
            --exit-code 0 \
            --output trivy-report.json \
            ${IMAGE_NAME}:${IMAGE_TAG}
          
          cat trivy-report.txt
          
          # Check for critical vulnerabilities
          if [ -f trivy-report.json ]; then
            CRITICAL_COUNT=\$(jq '[.Results[].Vulnerabilities[]? | select(.Severity=="CRITICAL")] | length' trivy-report.json)
            echo "Found \$CRITICAL_COUNT CRITICAL vulnerabilities"
            
            if [ "\$CRITICAL_COUNT" -gt "0" ] && [ "${params.FORCE_DEPLOY}" = "false" ]; then
              echo "❌ Found \$CRITICAL_COUNT CRITICAL vulnerabilities. Failing pipeline."
              exit 1
            fi
          else
            echo "Warning: trivy-report.json not found"
          fi
        """
        archiveArtifacts artifacts: 'trivy-report.*', fingerprint: true
      }
    }

    stage('Deploy to ECS') {
      steps {
        echo "Deploying to ECS (cluster: ${ECS_CLUSTER}, service: ${ECS_SERVICE})"
        sh """
          aws ecs update-service \
            --cluster ${ECS_CLUSTER} \
            --service ${ECS_SERVICE} \
            --force-new-deployment \
            --region ${AWS_REGION}
        """
        
        echo "Waiting for ECS service to stabilize..."
        sh """
          aws ecs wait services-stable \
            --cluster ${ECS_CLUSTER} \
            --services ${ECS_SERVICE} \
            --region ${AWS_REGION}
        """
      }
    }
    

    stage('Health Check') {
      steps {
        script {
          // Add your application health check URL
          // Example: curl -f http://your-alb-url/health || exit 1
          echo "Health check would run here..."

        }
      }
    }
  }

  post {
    always {
      echo "Cleaning up Docker..."
      sh 'docker system prune -af || true'
      
      // Clean up workspace
      cleanWs()
    }
    success {
      echo "✅ Pipeline completed successfully!"
      
      // Optional: Send success notification
      // emailext body: "Build ${BUILD_NUMBER} completed successfully!", subject: "Pipeline Success", to: 'team@example.com'
    }
    failure {
      echo "❌ Pipeline failed — check console output."
      
      // Optional: Send failure notification
      // emailext body: "Build ${BUILD_NUMBER} failed!\n\nCheck: ${BUILD_URL}", subject: "Pipeline Failed", to: 'team@example.com'
    }
  }
}
