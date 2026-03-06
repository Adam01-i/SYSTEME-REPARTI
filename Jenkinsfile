pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKERHUB_USER = "adam01tiret8"
        BACKEND_IMAGE = "${DOCKERHUB_USER}/systeme-reparti-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/systeme-reparti-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Adam01-i/SYSTEME-REPARTI'
            }
        }

        stage('Lint Backend') {
            steps {
                sh 'cd backend && pip3 install flake8 && flake8 . || true'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE:latest backend/'
                sh 'docker build -t $FRONTEND_IMAGE:latest frontend/'
            }
        }

        stage('Docker Login') {
            steps {
                sh """
                echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                """
            }
        }

        stage('Push Images') {
            steps {
                sh 'docker push $BACKEND_IMAGE:latest'
                sh 'docker push $FRONTEND_IMAGE:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful 🚀'
        }
        failure {
            echo 'Pipeline failed ❌'
        }
    }
}