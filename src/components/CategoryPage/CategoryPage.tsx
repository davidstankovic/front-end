import React from "react";
import { Container, Card, Col, Row, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";
import api, { ApiResponse } from '../../api/api';
import { Link } from 'react-router-dom';
import FurnitureType from "../../types/FurnitureType";
import { ApiConfig } from "../../config/api.confing";
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import RoleMainMenu from "../RoleMainMenu/RoleMainMenu";

interface CategoryPageProperties {
    match: {
        params: {
            cId: number;
        }
    }
}

interface CategoryPageState {
    category?: CategoryType;
    subcategories?: CategoryType[];
    furnitures?: FurnitureType[];
    message: string;
    filters: {
        keywords: string;
        priceMinimum: number;
        priceMaximum: number;
        order: "name asc" | "name desc" | "price asc" | "price desc";
        selectedFeatures: {
            featureId: number;
            value: string;
        }[];
    };
    features: {
        featureId: number;
        name: string;
        values: string[];
    }[];

}

interface FurnitureDto {
    furnitureId: number;
    status?: "available" | "visible" | "hidden";
    name: string;
    description?: string;
    furniturePrices?: {
        price: number;
        createdAt: string;
    }[],
    photos?: {
        imagePath: string;
    }[]
}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;
    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = {
            message: '',
            filters: {
                keywords: '',
                priceMinimum: 0.01,
                priceMaximum: 1000000,
                order: "price asc",
                selectedFeatures: [],
            },
            features: [],
        };
    }

    private setFeatures(features: any) {
        const newState = Object.assign(this.state, {
            features: features,
        });

        this.setState(newState);
    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message
        })
        this.setState(newState);
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category
        }))
    }

    private setSubcategories(subcategories: CategoryType[]) {
        this.setState(Object.assign(this.state, {
            subcategories: subcategories
        }))
    }

    private setFurnitures(furnitures: FurnitureType[]) {
        this.setState(Object.assign(this.state, {
            furnitures: furnitures
        }))
    }

    render() {
        return (
            <Container>
                 <RoleMainMenu role="visitor"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> {this.state.category?.name}
                        </Card.Title>
                        {this.printOptionalMessage()}

                        {this.showSubcategories()}
                        <Row>
                            <Col xs="12" md="4" lg="3">
                                {this.printFilters()}
                            </Col>
                            <Col xs="12" md="8" lg="9">
                                {this.showFurnitures()}
                            </Col>
                        </Row>
                        <Card.Text>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private setNewFilter(newFilter: any){
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }));
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));
    }

    private filterPriceMinChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMinimum: Number(event.target.value),
        }));
    }

    private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMaximum: Number(event.target.value),
        }));
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value,
        }));
    }

    private featureFilterChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const featureId = Number(event.target.dataset.featureId);
        const value = event.target.value;

        if (event.target.checked) {
            this.addFeatureFilterValue(featureId, value);
        } else {
            this.removeFeatureFilterValue(featureId, value);
        }
    }

    private addFeatureFilterValue(featureId: number, value: string) {
        const newSelectedFeatures = [...this.state.filters.selectedFeatures ];

        newSelectedFeatures.push({
            featureId: featureId,
            value: value,
        });

        this.setSelectedFeatures(newSelectedFeatures);
    }

    private removeFeatureFilterValue(featureId: number, value: string) {
        const newSelectedFeatures = this.state.filters.selectedFeatures.filter(record => {
            return !(record.featureId === featureId && record.value === value);
        });

        this.setSelectedFeatures(newSelectedFeatures);
    }

    private setSelectedFeatures(newSelectedFeatures: any) {
        this.setState(Object.assign(this.state, {
            filters: Object.assign(this.state.filters, {
                selectedFeatures: newSelectedFeatures,
            })
        }));

        console.log(this.state);
    }

    private applyFilters(){
   // console.log('Trenutni filteri su: ', this.state)
    this.getCategoryData();
    }

    private printFilters() {
        if (this.state.subcategories?.length === 0) {
       
        return (
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywords">
                        Search keywords:
                    </Form.Label>
                    <Form.Control type="text" id="keywords" value={this.state.filters.keywords} onChange={(e) => this.filterKeywordsChanged(e as any)} />
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="priceMin">
                                Min. price:
                            </Form.Label>
                            <Form.Control type="number" id="priceMin" step="0.01" min="0.01" max="999999.99" value={this.state.filters.priceMinimum} onChange={(e) => this.filterPriceMinChanged(e as any)} />

                        </Col>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor="priceMax">
                                Max. price:
                            </Form.Label>
                            <Form.Control type="number" id="priceMax" step="0.01" min="0.02" max="1000000" value={this.state.filters.priceMaximum} onChange={(e) => this.filterPriceMaxChanged(e as any)} />

                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Form.Control as="select" id="sortOrder" value={this.state.filters.order} onChange={(e) => this.filterOrderChanged(e as any)}>
                        <option value="name asc">Sort by name - ascending</option>
                        <option value="name desc">Sort by name - descending</option>
                        <option value="price asc">Sort by price - ascending</option>
                        <option value="price desc">Sort by price - descending</option>
                    </Form.Control>
                </Form.Group>
               
                { this.state.features.map(this.printFeatureFilterComponent, this) }

                <Form.Group>
                    <Button variant="primary" block onClick={() => this.applyFilters() }>
                        <FontAwesomeIcon icon={ faSearch }/> Search
                    </Button>
                </Form.Group>
            </>
        );
    }
    return;
    }

    private printFeatureFilterComponent(feature: { featureId: number; name: string; values: string[]; }) {
        return (
            <Form.Group>
                <Form.Label><strong>{ feature.name }</strong></Form.Label>
                { feature.values.map(value => this.printFeatureFilterCheckbox(feature, value), this) }
            </Form.Group>
        );
    }

    private printFeatureFilterCheckbox(feature: any, value: string){
      return( <Form.Check type="checkbox" label={ value } data-feature-id={ feature.featureId }
            onChange={ (event: any) => this.featureFilterChanged(event as any) } value={value}/>)
    }

    

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }
        return (
            <Card.Text>
                {this.state.message}
            </Card.Text>
        )
    }

    private showSubcategories() {
        if (this.state.subcategories?.length === 0) {
            return;
        }

        return (
            <Row>
                {this.state.subcategories?.map(this.singleCategory)}
            </Row>
        );
    }
    private singleCategory(category: CategoryType) {
        console.log(category.imagePath)
        return (
            <Col lg="3" md="4" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title as="p">
                            {category.name}
                     <img alt={ "Photo " + category.categoryId }
                             src={ ApiConfig.PHOTO_PATH + category.imagePath }
                             className="w-100"/>
                        </Card.Title>
                        <Link to={`/category/${category.categoryId}`} className="btn btn-primary btn-block btn-sm">
                            Open Category
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        )
    }


    private showFurnitures() {
        if (this.state.furnitures?.length === 0) {
            if (this.state.subcategories?.length === 0) {
                return (
                    <div>There are no furnitures to show in this category</div>
                )
            }
            return;
        }

        return (
            <Row>
                {this.state.furnitures?.map(this.singleFurniture)}
            </Row>
        )
    }

    private singleFurniture(furniture: FurnitureType) {
        return (
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Header>
                        <img alt={furniture.name} src={ApiConfig.PHOTO_PATH + furniture.imageUrl}
                            className="w-100" />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="p">
                            <strong> {furniture.name} </strong>
                        </Card.Title>
                        
                        {furniture.status === 'available' &&
                        <Card.Text>
                            Price: {Number(furniture.price).toFixed(2)} $
                        </Card.Text>
                        }
                        {furniture.status === 'hidden' &&
                        <Card.Text>
                            <strong>Out of stock!</strong>
                        </Card.Text>
                        }
                        {furniture.status === 'visible' &&
                        <Card.Text>
                            <strong>Out of stock!</strong>
                        </Card.Text>
                        }
                        <Link to={`/furniture/${furniture.furnitureId}`} className="btn btn-primary btn-block btn-sm">
                            Open Furniture page
            </Link>
                    </Card.Body>
                </Card>
            </Col>
        )
    }


    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }
        this.getCategoryData();
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.cId, 'get', {})
            .then((res: ApiResponse) => {
                if (res.status === 'error') {
                    return this.setMessage('Request error. Please try to refresh the page.');
                }

                const categoryData: CategoryType = {
                    categoryId: res.data.categoryId,
                    name: res.data.name,
                    imagePath: res.data.imagePath,
                    parentCategoryId: res.data.parentCategoryId
                };

                this.setCategoryData(categoryData);

                const subcategories: CategoryType[] = res.data.categories.map((category: ApiCategoryDto) => {
                    return {
                        categoryId: category.categoryId,
                        name: category.name,
                        imagePath: category.imagePath
                    }
                });

                this.setSubcategories(subcategories);
            });

            const orderParts = this.state.filters.order.split(' ');
            const orderBy = orderParts[0];
            const orderDirection = orderParts[1].toUpperCase();

            const featureFilters: any[] = [];

            for (const item of this.state.filters.selectedFeatures) {
                let found = false;
                let foundRef = null;
    
                for (const featureFilter of featureFilters) {
                    if (featureFilter.featureId === item.featureId) {
                        found = true;
                        foundRef = featureFilter;
                        break;
                    }
                }
    
                if (!found) {
                    featureFilters.push({
                        featureId: item.featureId,
                        values: [ item.value ],
                    });
                } else {
                    foundRef.values.push(item.value);
                }
            }

        api('api/furniture/search', 'post', {
            categoryId: Number(this.props.match.params.cId),
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMinimum,
            priceMax: this.state.filters.priceMaximum,
            features: featureFilters,
            orderBy: orderBy,
            orderDirection: orderDirection
        }).then((res: ApiResponse) => {
            if (res.status === 'error') {
                return this.setMessage('Request error. Please try to refresh the page.');
            }

            if (res.data.statusCode === 0) {
                this.setMessage('');
                this.setFurnitures([]);
                return;
            }

            const furnitures: FurnitureType[] = res.data.map((furniture: FurnitureDto) => {

                const object: FurnitureType = {
                    furnitureId: furniture.furnitureId,
                    name: furniture.name,
                    description: furniture.description,
                    status: furniture.status,
                    imageUrl: '',
                    price: 0,
                }

                if (furniture.photos !== undefined && furniture.photos?.length > 0) {
                    object.imageUrl = furniture.photos[furniture.photos?.length - 1].imagePath
                }

                if (furniture.furniturePrices !== undefined && furniture.furniturePrices?.length > 0) {
                    object.price = furniture.furniturePrices[furniture.furniturePrices?.length - 1].price;
                }

                return object
            })

            this.setFurnitures(furnitures);
        });
        this.getFeatures();
    }
    getFeatures() {
        api('api/feature/values/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return this.setMessage('Request error. Please try to refresh the page.');
            }

            this.setFeatures(res.data.features);
        });
    }
}